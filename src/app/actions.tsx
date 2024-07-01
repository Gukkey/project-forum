"use server"

import { createSection } from "@projectforum/server/db/queries"
import { InsertDiscussionThreads, InsertSection } from "@projectforum/server/db/schema"
import { createDiscussionThread } from "@projectforum/server/db/queries"
import { getSectionId } from "@projectforum/server/db/queries"
import { logger } from "@projectforum/lib/logger"

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
  const sectionId = await getSectionId(topicId)

  logger.debug(text)

  const data: InsertDiscussionThreads = {
    title: formdata.get("title") as string,
    content: text,
    sectionId: sectionId[0].sectionId,
    topicId: topicId,
    userId: formdata.get("userId") as string
  }
  await createDiscussionThread(data)
}
