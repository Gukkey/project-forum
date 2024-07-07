import { getDiscussionThread } from "@projectforum/server/db/queries"
import React from "react"
import { logger } from "@projectforum/lib/logger"
import RepliesSection from "../../ReplySection"

export default async function ThreadPage({
  params
}: {
  params: { threadId: string; topicId: string }
}) {
  const threads = await getDiscussionThread(params.threadId)

  logger.debug(params.topicId)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <RepliesSection threads={threads} />
    </div>
  )
}
