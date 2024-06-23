import { discussionThreads } from "@projectforum/server/db/schema"
import { Redis } from "@upstash/redis"
import { CronJob } from "cron"
import { addAnimeInRedis } from "./helper"
import { db } from "@projectforum/server/db"
import { fetchAnime, fetchNextEpisodeAiringAt } from "./anilist"
import { logCronJob } from "./helper"

export const runtime = "edge"

const anime = [21, 153288, 966, 163139, 235]

const job = new CronJob("*/10 * * * *", () => {
  // Define a object for our Redis DB
  const redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN
  })

  // Check whether all anime in Anime[] is present in redis
  // if they dont, add them in redis
  anime.forEach((anime) => {
    if (!redis.exists(anime.toString(10))) {
      addAnimeInRedis(anime)
    }
  })

  // Check whether an (Unixstamp) value is 10 minutes or less old than current time,
  // since it is a cron job that is executed every 10 minutes,
  // every 5 minutes we check whether a value has passed current time and if they do we make a discussion thread,
  // and then update the value in the key

  const currentTime = Date.now()
  anime.forEach((anime) => {
    redis.get(anime.toString(10)).then((value) => {
      if (value === null) {
        logCronJob(`${anime} returned NaN value ${value}`)
      }

      const timestamp = value as number

      if (Math.abs(timestamp - currentTime) <= 600) {
        fetchAnime(anime)
          .then((data) => {
            const episode = data.data.Media.nextAiringEpisode.airingAt
            const animeName = data.data.Media.title
            const post = {
              title: `${animeName} ${episode} - EPISODE DISCUSSION`,
              content: `This thread is automated`,
              sectionId: process.env.CRON_JOB_SECTION_ID,
              topicId: process.env.CRON_JOB_TOPIC_ID
            }

            const nextAiringEpisode = episode + 1

            db.insert(discussionThreads)
              .values(post as any)
              .then(() => {
                fetchNextEpisodeAiringAt(nextAiringEpisode).then((data) => {
                  redis
                    .set(anime.toString(10), data.data.nextAiringEpisode.airingAt)
                    .catch((err) => {
                      console.log(err)
                    })
                  logCronJob(`A new episode thread for ${post.title} has been released...`)
                })
              })
              .catch((err) => {
                logCronJob(`Caught err: ${err}`)
              })
          })
          .catch((err) => {
            logCronJob(`Caught err: ${err}`)
          })
      }
    })
  })

  logCronJob(`Nothing happened`)
})

job.start()
