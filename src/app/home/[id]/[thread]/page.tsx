import { getDiscussionThread } from "@projectforum/server/db/queries"
import Link from "next/link"
import React from "react"

export default async function ThreadPage({ params }: { params: { id: string; thread: string } }) {
  const threads = await getDiscussionThread(params.thread)

  console.log(params.thread)
  console.log(params.id)

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
                    <td dangerouslySetInnerHTML={{ __html: thread.content }}></td>
                  </tr>
                </tbody>
              </React.Fragment>
            ))}
          </table>
        </div>
        <aside className="flex-1 lg:flex-none lg:w-64 bg-gray-800 p-6 rounded-lg mt-6 lg:mt-0 lg:ml-6">
          <div className="mb-6">
            <h3 className="text-xl mb-4">Actions</h3>
            <Link
              href={`/home/${params.id}/${params.thread}/create`}
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
  )
}
