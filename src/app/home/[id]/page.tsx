import { getAllDiscussionThreads } from "@projectforum/server/db/queries"
import Link from "next/link"
import React from "react"

export default async function DynamicPage({ params }: { params: { id: string } }) {
  const threads = await getAllDiscussionThreads(params.id)
  console.log(threads)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      <header className="bg-gray-650 p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Project Forum</div>
        <nav className="space-x-4">
          <Link href="/home" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="  " className="text-gray-300 hover:text-white">
            Topics
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            Community
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            Support
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            Other
          </Link>
        </nav>
      </header>
      <div className="flex flex-col lg:flex-row p-6">
        <div className="flex-1 bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl mb-4">Topic</h2>
          <table className="w-full text-left">
            {threads.map((thread) => (
              <React.Fragment key={thread.id}>
                <thead>
                  <th className="pb-2 border-b border-gray-700">
                    <tr>
                      <Link href={`/home/${params.id}/${thread.id}`}>
                        <th className="px-4 py-2 text-left text-xl">{thread.title}</th>
                      </Link>
                    </tr>
                  </th>
                </thead>
              </React.Fragment>
            ))}
          </table>
        </div>
      </div>
      {/* <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold text-left mb-6">Topic</h1>
      <table className="min-w-full table-auto">
        <p> Topic ID: {params.id}</p>
        {threads.map((thread) => (
          <React.Fragment key={thread.id}>
            <thead>
              <tr>
                <Link href={`/home/${params.id}/${thread.id}`}>
                  <th className="px-4 py-2 text-left text-xl">{thread.title}</th>
                </Link>
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
    </div> */}
    </div>
  )
}
