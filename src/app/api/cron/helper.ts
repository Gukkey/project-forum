import { Redis } from "@upstash/redis"
import { fetchAnime } from "./anilist"
import { createCronJobLogs, createDiscussionThread } from "@projectforum/server/db/queries"
import { NextResponse } from "next/server"
import { discussionThreads } from "@projectforum/server/db/schema"
import { db } from "@projectforum/server/db"
import { eq } from "drizzle-orm"

const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
})

export function addAnimeInRedis(anime: number) {
  fetchAnime(anime)
    .then((data) => redis.set(anime.toString(10), data.data.Media.nextAiringEpisode.airingAt))
    .catch((err) => {
      console.log(`Error: ${err}`)
      NextResponse.json({ message: `${err}` }, { status: 400 })
    })
}

export function logCronJob(
  message: any,
  isError?: boolean,
  animeAdded?: boolean,
  nothingHappened?: boolean
) {
  const log = {
    log: message,
    ...(isError !== undefined && { isError }),
    ...(animeAdded !== undefined && { animeAdded }),
    ...(nothingHappened !== undefined && { nothingHappened })
  }
  createCronJobLogs(log)
}

export async function addAnimeInDiscussionThread(animeId: number, idx: number) {
  const data = await fetchAnime(animeId)
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
      .where(eq(discussionThreads.title, post.title))

    if (checkForTitle.length > 0) {
      logCronJob(`duplicate post ${post.title} index: ${idx}`)
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
    logCronJob(`A new episode thread for ${post.title} has been released... index: ${idx}`)
  } catch (err) {
    logCronJob(`${err instanceof Error ? err.stack : err} index: ${idx}`)
  }
}

export async function checkIfAnimeReleasesSoon(animeId: number, idx: number) {
  // gets the unix timestamp value (in seconds) for the upcoming episode
  const value = await redis
    .get(animeId.toString(10))
    .catch((err) => `${err instanceof Error ? err.stack : err}`)

  if (value === null) {
    logCronJob(`${animeId} returned NaN value ${value} index: ${idx}`)
  }

  const timestamp = Number(value)
  const currentTime = Math.floor(new Date().getTime() / 1000.0) // Converting seconds to milliseconds

  // checks if the current time is in 10 minutes window after the anime episode gets released
  if (timestamp >= currentTime && timestamp - currentTime <= 10 * 60) {
    logCronJob(`timestamp: ${timestamp} currentTime: ${currentTime} anime id: ${animeId}`)

    // invokes addAnimeInDiscussuinThread and then checks again whether the next episode just got released
    // now two episodes getting released in same time is rare but we are covering this
    addAnimeInDiscussionThread(animeId, idx)
    checkIfAnimeReleasesSoon(animeId, idx)
  } else {
    return
  }
}
