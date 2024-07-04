import { sql } from "drizzle-orm"
import {
  boolean,
  pgTableCreator,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core"

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */

export const createTable = pgTableCreator((name) => `example-project-1_${name}`)

// TODO: Find a way to make updatedAt update its timestamp when a record is updated.
// .$onUpdate(() => new Date()) and .$onUpdate(() => sql`CURRENT_TIMESTAMP`), didnt work

export const sections = createTable(
  "section",
  {
    id: uuid("id")
      .default(sql`gen_random_uuid()`)
      .unique()
      .primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
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
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    sectionId: uuid("section_id")
      .references(() => sections.id)
      .notNull()
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
    title: varchar("name", { length: 1024 }).notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updatedAt")
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
    topicId: uuid("topic_id")
      .references(() => topics.id)
      .notNull(),
    userId: varchar("user_id", { length: 50 })
      .references(() => users.id)
      .notNull()
  },
  (discussionThreads) => {
    return {
      discussionThreadsIdx: uniqueIndex("discussion_thread_idx").on(discussionThreads.title)
    }
  }
)

export const cronJobLogs = createTable("cron_job_logs", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .unique()
    .primaryKey(),
  log: text("logs"),
  animeAdded: boolean("anime_added").default(false),
  gotError: boolean("got_error").default(false),
  nothingHappened: boolean("nothing_happened").default(true)
})

export const users = createTable(
  "users",
  {
    id: varchar("id", { length: 50 }).notNull().unique().primaryKey(),
    name: text("name"),
    role: text("role").$type<"admin" | "member" | "mod">(),
    email: text("email").notNull(),
    imageUrl: text("image_url")
  },
  (users) => {
    return {
      usersIdx: uniqueIndex("users_idx").on(users.id)
    }
  }
)

export const replies = createTable("discussion_thread_replies", {
  id: uuid("id")
    .default(sql`gen_random_uuid()`)
    .unique()
    .primaryKey(),
  discussionThreadId: uuid("discussion_thread_id")
    .references(() => discussionThreads.id)
    .notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`),
  userId: varchar("user_id", { length: 50 })
    .references(() => users.id)
    .notNull()
})

export type InsertSection = typeof sections.$inferInsert
export type SelectSection = typeof sections.$inferSelect

export type InsertTopic = typeof topics.$inferInsert
export type SelectTopic = typeof topics.$inferSelect

export type InsertDiscussionThreads = typeof discussionThreads.$inferInsert
export type SelectDiscussionThreads = typeof discussionThreads.$inferSelect

export type InsertCronJobLogs = typeof cronJobLogs.$inferInsert
export type SelectCronJobLogs = typeof cronJobLogs.$inferSelect

export type InsertUser = typeof users.$inferInsert
export type InsertReplies = typeof replies.$inferInsert
export type SelectReplies = typeof replies.$inferSelect
