import { type Config } from "drizzle-kit"
import { env } from "@projectforum/env"

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: env.POSTGRES_URL
  },
  tablesFilter: ["example-project-1_*"]
} satisfies Config