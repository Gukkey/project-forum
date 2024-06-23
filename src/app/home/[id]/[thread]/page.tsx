import { getDiscussionThread } from "@projectforum/server/db/queries"
import React from "react"
import Link from "next/link"

export default async function ThreadPage({ params }: { params: { thread: string } }) {
  const threads = await getDiscussionThread(params.thread)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <header className="bg-gray-650 p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Project Forum</div>
        <nav className="space-x-4">
          <Link href="/home" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            Topics
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            Community
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            Support
          </Link>
          <a href="#" className="text-gray-300 hover:text-white">
            Other
          </a>
        </nav>
      </header>
      <div className="flex flex-col lg:flex-row p-6">
        <div className="flex-1 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Thread page</h2>
          <table className="w-full text-left">
            {threads.map((thread) => (
              <React.Fragment key={thread.id}>
                <thead>
                  <tr>
                    <th className="pb-2 border-b border-gray-700">{thread.title}</th>
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
      </div>
    </div>
  )
}
