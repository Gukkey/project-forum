import { getDiscussionThread } from "@projectforum/server/db/queries"
import React from "react"
import { logger } from "@projectforum/lib/logger"

export default async function ThreadPage({
  params
}: {
  params: { sectionId: string; topicId: string }
}) {
  const threads = await getDiscussionThread(params.topicId)

  logger.debug(params.topicId)
  logger.debug(params.sectionId)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <div className="flex flex-col lg:flex-row p-6">
        <div className="flex-1 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Thread page</h2>
          <table className="w-full text-left">
            {threads.map((thread) => (
              <React.Fragment key={thread.sectionId}>
                <thead>
                  <tr>
                    <th className="pb-2 border-b border-gray-700">{thread.title}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td dangerouslySetInnerHTML={{ __html: thread.content }}></td>
                  </tr>
                </tbody>
              </React.Fragment>
            ))}
          </table>
        </div>
      </div>
    </div>
  )
}
