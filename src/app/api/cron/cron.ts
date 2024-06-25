import { Redis } from "@upstash/redis"
import { CronJob } from "cron"
import { addAnimeInRedis, logCronJob } from "./helper"
import { fetchAnime } from "./anilist"
import { createDiscussionThread } from "@projectforum/server/db/queries"
import { discussionThreads } from "@projectforum/server/db/schema"
import { db } from "@projectforum/server/db"
import { title } from "process"
import { eq } from "drizzle-orm"
// import { NextResponse } from "next/server"

export const fetchCache = "force-no-store"

const anime: number[] = process.env.CRON_JOB_ANIME_ID_ARRAY?.split(",").map(Number) || []

// Initialize Redis outside of the job function
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
})

export const job = new CronJob("*/10 * * * *", async () => {
  try {
    // Check and add anime to Redis
    anime.map(async (animeId) => {
      const exists = await redis.exists(animeId.toString(10))
      if (!exists) {
        addAnimeInRedis(animeId)
      }
    })

    const currentTime = Date.now()
    // await Promise.all(
    anime.map(async (animeId, idx) => {
      const value = await redis
        .get(animeId.toString(10))
        .catch((err) => `${err instanceof Error ? err.stack : err}`)
      if (value === null) {
        logCronJob(`${animeId} returned NaN value ${value} index: ${idx}`)
      }

      const timestamp = Number(value)
      const data = await fetchAnime(animeId)

      if (timestamp - currentTime <= 10 * 60 * 100 && timestamp - currentTime >= 0) {
        console.log(`${timestamp} ${currentTime}`)
        logCronJob(`timestamp: ${timestamp} currentTime: ${currentTime} idx: ${idx}`)
        try {
          const animeName = data.data.Media.title.english
          const episode = data.data.Media.nextAiringEpisode.episode
          const post = {
            title: `${animeName} - EPISODE ${episode} DISCUSSION`,
            content: `This thread is automated`,
            sectionId: process.env.CRON_JOB_SECTION_ID as string,
            topicId: process.env.CRON_JOB_TOPIC_ID as string,
            userId: process.env.CRON_JOB_TOPIC_ID as string
          }

          const nextEpisode = episode + 1

          const checkForTitle = await db
            .select()
            .from(discussionThreads)
            .where(eq(discussionThreads.title, title))

          if (checkForTitle.length > 0) {
            logCronJob(`duplicate post ${title} index: ${idx}`)
          }

          createDiscussionThread(post).then(async () => {
            const nextEpisodeData = await fetchAnime(nextEpisode)
            await redis
              .set(animeId.toString(10), data.data.Media.nextAiringEpisode.airingAt)
              .catch((err) => {
                logCronJob(
                  `${err instanceof Error ? err.stack : err} redis key value: ${animeId.toString(10)} ${nextEpisodeData.data.Media.nextAiringEpisode.airingAt} index: ${idx}`
                )
              })
          })
          logCronJob(`${timestamp - currentTime} idx: ${idx}`)
          logCronJob(`A new episode thread for ${post.title} has been released... index: ${idx}`)
        } catch (err) {
          logCronJob(`${err instanceof Error ? err.stack : err} index: ${idx}`)
        }
      }
    })
    // )
    logCronJob(`Cron job completed index:`)
  } catch (err) {
    logCronJob(`${err instanceof Error ? err.stack : err}`)
  }
})
