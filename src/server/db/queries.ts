import { desc, eq } from "drizzle-orm"
import { db } from "."
import {
  InsertCronJobLogs,
  InsertDiscussionThreads,
  InsertSection,
  InsertTopic,
  InsertUser,
  SelectDiscussionThreads,
  SelectSection,
  SelectTopic,
  cronJobLogs,
  discussionThreads,
  sections,
  topics,
  users
} from "./schema"

export async function createSection(data: InsertSection) {
  await db.insert(sections).values(data)
}

export async function createTopic(data: InsertTopic) {
  await db.insert(topics).values(data)
}

export async function createDiscussionThread(data: InsertDiscussionThreads) {
  await db.insert(discussionThreads).values(data)
}

export async function getAllSections() {
  return db.select().from(sections)
}

export async function getAllTopics(id: SelectSection["id"]) {
  return db.select().from(topics).where(eq(topics.sectionId, id))
}

export async function getAllDiscussionThreads(id: SelectTopic["id"]) {
  return db
    .select()
    .from(discussionThreads)
    .where(eq(discussionThreads.topicId, id))
    .orderBy(desc(discussionThreads.updatedAt))
}

export async function getLatestDiscussionThread(id: SelectTopic["id"]) {
  return await db
    .select()
    .from(discussionThreads)
    .where(eq(discussionThreads.topicId, id))
    .orderBy(desc(discussionThreads.updatedAt))
    .limit(1)
}

export async function getDiscussionThread(id: SelectDiscussionThreads["id"]) {
  return await db.select().from(discussionThreads).where(eq(discussionThreads.id, id))
}

export async function getServerId(id: SelectTopic["id"]) {
  return await db.select({ sectionId: topics.sectionId }).from(topics).where(eq(topics.id, id))
}

export async function createCronJobLogs(data: InsertCronJobLogs) {
  return await db.insert(cronJobLogs).values(data)
}

export async function createUserAfterSignUp(data: InsertUser) {
  await db.insert(users).values(data)
}
