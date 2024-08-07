import { createEnv } from "@t3-oss/env-nextjs"
import { configDotenv } from "dotenv"
import { z } from "zod"

configDotenv({ path: [".env.local"] })
export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    USE_LOCAL_DB: z.enum(["true", "false"]).default("true"),
    POSTGRES_URL: z.string().url(),
    POSTGRES_URL_LOCAL: z.string().url(),
    WEBHOOK_SECRET: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development")
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
    NEXT_PUBLIC_REDIS_URL: z.string().url(),
    NEXT_PUBLIC_REDIS_TOKEN: z.string()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  experimental__runtimeEnv: {
    // POSTGRES_URL: process.env.POSTGRES_URL,
    // NODE_ENV: process.env.NODE_ENV
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
    NEXT_PUBLIC_REDIS_URL: process.env.NEXT_PUBLIC_REDIS_URL,
    NEXT_PUBLIC_REDIS_TOKEN: process.env.NEXT_PUBLIC_REDIS_TOKEN
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
