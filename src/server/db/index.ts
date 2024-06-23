import { sql } from "@vercel/postgres"
import { VercelPgDatabase, drizzle as vercelDrizzle } from "drizzle-orm/vercel-postgres"
import { NodePgDatabase, drizzle as nodeDrizzle } from "drizzle-orm/node-postgres"
import { Client } from "pg"
import * as schema from "./schema"
import { env } from "@projectforum/env"

import { logger } from "@projectforum/lib/logger"

let db: NodePgDatabase<typeof schema> | VercelPgDatabase<typeof schema>

if (env.NODE_ENV == "development" && env.USE_LOCAL_DB === "true") {
  // use local db only if the env is "development" and USE_LOCAL_DB is set true in .env.local
  const client = new Client({
    connectionString: env.POSTGRES_URL_LOCAL
  })
  ;(async () => await client.connect())()

  db = nodeDrizzle(client, { schema }) as NodePgDatabase<typeof schema>
  logger.debug("Using Local DB")
} else {
  // use vercel postgres
  db = vercelDrizzle(sql, { schema }) as VercelPgDatabase<typeof schema>
  logger.debug("Using Vercel DB")
}

export { db }
