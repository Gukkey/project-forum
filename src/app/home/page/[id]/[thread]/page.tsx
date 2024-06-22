import { getDiscussionThread } from "@projectforum/server/db/queries"
import React from "react"

export default async function ThreadPage({ params }: { params: { thread: string } }) {
  const threads = await getDiscussionThread(params.thread)

  return (
    <div>
      <h1> Thread Page </h1>
      {/* <p> Thread: {params.id}</p> */}
      {/* <p> Title: {thread.title}</p>
      <p> Content: {thread.content}</p>
      <p> Created At: {thread.created_at}</p>
      <p> Updated At: {thread.updated_at}</p> */}

      <table>
        {threads.map((thread) => (
          <React.Fragment key={thread.id}>
            <thead>
              <tr>
                <th>{thread.title}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{thread.content}</td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
    </div>
  )
}
