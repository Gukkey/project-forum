import { Redis } from "@upstash/redis"
import { CronJob } from "cron"
import { addAnimeInRedis, checkIfAnimeReleasesSoon, logCronJob } from "./helper"
import { env } from "@projectforum/env"

export const fetchCache = "force-no-store"

const anime: number[] = env.CRON_JOB_ANIME_ID_ARRAY?.split(",").map(Number) || []

// Initialize Redis outside of the job function
const redis = new Redis({
  url: env.REDIS_URL,
  token: env.REDIS_TOKEN
})

export const job = new CronJob("*/10 * * * *", async () => {
  try {
    // Check and add anime to Redis
    anime.map(async (animeId, idx) => {
      const exists = await redis.exists(animeId.toString(10))
      if (exists === 0) {
        await addAnimeInRedis(animeId)
      }
      await checkIfAnimeReleasesSoon(animeId, idx)
    })
    logCronJob(`Cron job completed, no anime is added.`)
  } catch (err) {
    logCronJob(`${err instanceof Error ? err.stack : err}`)
  }
})
