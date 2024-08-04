// import { getDiscussionThread } from "@projectforum/server/db/queries"
import React from "react"
import { logger } from "@projectforum/lib/logger"
import { getDiscussionThread } from "@projectforum/db/queries"

export default async function ThreadPage({
  params
}: {
  params: { threadId: string; topicId: string }
}) {
  const threads = await getDiscussionThread(params.threadId)

  logger.debug(params.topicId)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <div className="flex flex-col lg:flex-row p-6">
        <div className="flex-1 bg-gray-800 p-6 rounded-lg">
          {/* <h2 className="text-2xl mb-4">Thread page</h2> */}
          <div className="w-full text-left">
            {threads &&
              threads.map((thread) => (
                <React.Fragment key={thread.id}>
                  <div>
                    <h1 className="mb-2 text-2xl font-extrabold border-b border-gray-700">
                      {thread.name}
                    </h1>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: thread.content }}></div>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
