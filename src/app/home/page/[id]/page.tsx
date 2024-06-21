import { getAllDiscussionThreads } from "@projectforum/server/db/queries"
import React from "react"

export default async function DynamicPage({ params }: { params: { id: string } }) {
  const threads = await getAllDiscussionThreads(params.id)

  return (
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold text-left mb-6">Topic</h1>
      <table className="min-w-full table-auto">
        {/* <p> Topic ID: {params.id}</p> */}
        {threads.map((thread) => (
          <React.Fragment key={thread.id}>
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xl">{thread.title}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="px-4 py-2">{thread.content}</td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
    </div>
  )
}
