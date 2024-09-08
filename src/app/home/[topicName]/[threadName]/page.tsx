import React from "react"
import BBcode from "@bbob/react"
import reactPreset from "@bbob/preset-react"
import { getThread } from "@projectforum/app/actions"

export default async function ThreadPage({
  params
}: {
  params: { threadName: string; topicName: string }
}) {
  const thread = await getThread(params.threadName)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 bg-gray-800 p-6 rounded-lg">
          <div className="w-full text-left">
            <div>
              <h1 className="mb-2 text-2xl font-extrabold border-b border-gray-700">
                {thread.name}
              </h1>
            </div>
            <div>
              <BBcode plugins={[reactPreset()]}>{thread.content}</BBcode>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
