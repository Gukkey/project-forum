import { getAllDiscussionThreads, getTopicById } from "@projectforum/db/queries"
import Link from "next/link"
import React from "react"

export default async function TopicPage({ params }: { params: { topicId: string } }) {
  const threads = await getAllDiscussionThreads(params.topicId)
  const topic = await getTopicById(params.topicId)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <div className="flex flex-col lg:flex-row p-6">
        <div className="flex-1 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl mb-4 font-extrabold">{topic?.name}</h2>
          {threads && (
            <div className="w-full text-left">
              {threads.map((thread) => (
                <React.Fragment key={thread.id}>
                  <div>
                    <div className="pb-2 border-b border-gray-700">
                      <div>
                        <Link href={`/home/${params.topicId}/${thread.id}`}>
                          <p className=" py-2 text-left text-lg">{thread.name}</p>
                        </Link>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        <div>
          <aside className="flex-1 lg:flex-none lg:w-64 bg-gray-800 p-6 rounded-lg mt-6 lg:mt-0 lg:ml-6">
            <div className="mb-6">
              <h3 className="text-xl mb-4">Actions</h3>
              <Link
                href={`/home/${params.topicId}/create`}
                className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 mb-2 rounded"
              >
                <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 mb-2 rounded">
                  Create New Thread
                </button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
