import { desc, eq } from "drizzle-orm"
import { db } from "."
import {
  InsertCronJobLogs,
  InsertDiscussionThreads,
  InsertReplies,
  InsertSection,
  InsertTopic,
  InsertUser,
  SelectDiscussionThreads,
  SelectReplies,
  SelectTopic,
  cronJobLogs,
  discussionThreads,
  replies,
  sections,
  topics,
  users
} from "./schema"
import { logger } from "@projectforum/lib/logger"

export async function createSection(data: InsertSection) {
  await db.insert(sections).values(data)
}

export async function createTopic(data: InsertTopic) {
  await db.insert(topics).values(data)
}

export async function createDiscussionThread(data: InsertDiscussionThreads) {
  logger.debug(data)
  await db.insert(discussionThreads).values(data)
}

export async function getAllDiscussionThreads(id: SelectTopic["id"]) {
  return db
    .select({
      id: discussionThreads.id,
      title: discussionThreads.title,
      content: discussionThreads.content,
      userId: discussionThreads.userId
    })
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

export async function getSectionId(id: SelectTopic["id"]) {
  console.log(id)
  return await db.select({ sectionId: topics.sectionId }).from(topics).where(eq(topics.id, id))
}

export async function createCronJobLogs(data: InsertCronJobLogs) {
  return await db.insert(cronJobLogs).values(data)
}

export async function createUserAfterSignUp(data: InsertUser) {
  await db.insert(users).values(data)
}

export async function getUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id))
}

type Topic = {
  id: string
  name: string
}

export interface SectionWithTopics {
  id: string
  name: string
  topics: Topic[]
}

export async function getSectionsWithTopics(): Promise<SectionWithTopics[]> {
  const query = await db
    .select({
      sectionId: sections.id,
      sectionName: sections.name,
      topicId: topics.id,
      topicName: topics.name
    })
    .from(sections)
    .innerJoin(topics, eq(sections.id, topics.sectionId))

  const groupedResults = query.reduce((arr, idx) => {
    const section = arr.find((s) => s.id === idx.sectionId)
    if (section) {
      section.topics.push({ id: idx.topicId, name: idx.topicName })
    } else {
      arr.push({
        id: idx.sectionId,
        name: idx.sectionName,
        topics: [{ id: idx.topicId, name: idx.topicName }]
      })
    }
    return arr
  }, [] as SectionWithTopics[])

  return groupedResults
}

export async function insertReply(data: InsertReplies) {
  return await db.insert(replies).values(data)
}

export async function getAllReplies(discussionThreadId: SelectReplies["discussionThreadId"]) {
  await db
    .select({
      id: replies.id,
      content: replies.content,
      userId: replies.userId
    })
    .from(replies)
    .where(eq(replies.discussionThreadId, discussionThreadId))
    .orderBy(desc(replies.createdAt))
}
