import { createEnv } from "@t3-oss/env-nextjs"
// import { configDotenv } from "dotenv"
import { z } from "zod"

// configDotenv({ path: [".env"] })
export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    WEBHOOK_SECRET: z.string(),
    REDIS_URL: z.string().url(),
    REDIS_TOKEN: z.string(),
    CRON_JOB_ANIME_ID_ARRAY: z.string().optional(),
    CRON_JOB_TOPIC_ID: z.string(),
    CRON_JOB_USER_ID: z.string(),
    CRON_JOB_SECTION_ID: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development")
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  experimental__runtimeEnv: {
    WEBHOOK_SECRET: process.env.WEBHOOK_SECRET,
    REDIS_URL: process.env.REDIS_URL,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    CRON_JOB_ANIME_ID_ARRAY: process.env.REDIS_TOKEN,
    CRON_JOB_TOPIC_ID: process.env.REDIS_TOKEN,
    CRON_JOB_USER_ID: process.env.REDIS_TOKEN,
    CRON_JOB_SECTION_ID: process.env.REDIS_TOKEN
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true
})
