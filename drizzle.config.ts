import { type Config } from "drizzle-kit"
import { env } from "@projectforum/env"

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.NODE_ENV == "development" ? env.POSTGRES_URL_LOCAL : env.POSTGRES_URL
  },
  tablesFilter: ["example-project-1_*"]
} satisfies Config
