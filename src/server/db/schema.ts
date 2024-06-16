import { sql } from "drizzle-orm"
import { pgTableCreator, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `example-project-1_${name}`)

export const sections = createTable(
  "section",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .unique()
      .primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
  },
  (sections) => {
    return {
      sectionIdx: uniqueIndex("section_idx").on(sections.name)
    }
  }
)

export const topics = createTable(
  "topic",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .unique()
      .primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    sectionId: uuid("section_id").references(() => sections.id)
  },
  (topics) => {
    return {
      topicIdx: uniqueIndex("topics_idx").on(topics.name)
    }
  }
)

export const discussionThreads = createTable(
  "discussion_threads",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .unique()
      .primaryKey(),
    name: varchar("name", { length: 1024 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
    sectionId: uuid("section_id").references(() => sections.id),
    topicId: uuid("topic_id").references(() => topics.id)
  },
  (discussionThreads) => {
    return {
      discussionThreadsIdx: uniqueIndex("discussion_thread_idx").on(discussionThreads.name)
    }
  }
)
