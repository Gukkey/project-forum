import React from "react"

import { getThread } from "@projectforum/app/actions"
import { ContentCard } from "@projectforum/components/content-card"
import { ReplyForm } from "@projectforum/components/reply-form"
import { getRepliesByThread } from "@projectforum/db/queries"
import { auth } from "@clerk/nextjs/server"

export default async function ThreadPage({
  params
}: {
  params: { threadName: string; topicName: string }
}) {
  const resultSet = await getThread(params.threadName)
  const thread = resultSet[0]
  const userId = auth().userId

  const repliesResultSet = await getRepliesByThread(thread.id)

  return (
    <div className="min-h-screen  w-full bg-gray-900 text-gray-300 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 bg-gray-800  rounded-lg">
          {thread && (
            <ContentCard
              name={thread.name}
              content={thread.content}
              timestamp={new Date(thread.created_at).toDateString()}
              role={thread.role}
              username={thread.username}
            />
          )}
        </div>

        {repliesResultSet &&
          repliesResultSet.length > 0 &&
          repliesResultSet.map((reply) => (
            <ContentCard
              key={reply.id}
              content={reply.content}
              timestamp={new Date(reply.created_at).toDateString()}
              role={reply.role}
              username={reply.username}
            />
          ))}

        {userId && (
          <ReplyForm
            threadId={thread.id}
            userId={userId}
            topicName={params.topicName}
            threadName={params.threadName}
          />
        )}
      </div>
    </div>
  )
}
