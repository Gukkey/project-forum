"use server"

import { createSection, getUserById } from "@projectforum/server/db/queries"
import { InsertDiscussionThreads, InsertSection } from "@projectforum/server/db/schema"
import { createDiscussionThread } from "@projectforum/server/db/queries"
import { logger } from "@projectforum/lib/logger"
import { auth } from "@clerk/nextjs/server"

export async function createNewSection(formdata: FormData) {
  const data: InsertSection = {
    name: formdata.get("name") as string,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  await createSection(data)
}

export async function createNewThread(text: string, formdata: FormData) {
  const content = formdata.get("content") as string

  // Check if content is empty
  if (!content.trim()) {
    logger.error(" Content is empty ")
    return // Exit the function early
  }

  if (content === "<p></p>") {
    logger.error(" Content is empty ")
    return // Exit the function early
  }

  const topicId = formdata.get("topicId") as string

  logger.debug(text)

  const data: InsertDiscussionThreads = {
    title: formdata.get("title") as string,
    content: text,
    topicId: topicId,
    userId: formdata.get("userId") as string
  }
  await createDiscussionThread(data)
}

export async function getUserRole() {
  const userId = auth().userId

  if (!userId) return null

  const userData = await getUserById(userId)
  return userData[0].role
}
