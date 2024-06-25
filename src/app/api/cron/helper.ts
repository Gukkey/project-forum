import { Redis } from "@upstash/redis"
import { fetchAnime } from "./anilist"
import { createCronJobLogs } from "@projectforum/server/db/queries"
import { NextResponse } from "next/server"

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
