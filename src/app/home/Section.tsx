"use client"
import Link from "next/link"
import React from "react"

interface ThreadType {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date | null
}

interface TopicType {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date | null
  threads: ThreadType[]
}

interface SectionType {
  id: string
  name: string
  topics: TopicType[]
}

export const Section = ({ sections }: { sections?: SectionType[] }) => {
  const handleSectionClick = () => {}

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
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
          <table className="w-full text-left">
            {sections?.map((section) => (
              <React.Fragment key={section.id}>
                <thead>
                  <tr>
                    <th className="pb-2 border-b border-gray-700" onClick={handleSectionClick}>
                      {section.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {section.topics.length === 0 ? (
                    <tr>
                      <td className="py-2">No topics found</td>
                    </tr>
                  ) : (
                    section.topics.map((topic) => (
                      <tr key={topic.id} className="border-t">
                        <td className="py-2">
                          <Link href={`home/${topic.id}`} className="text-blue-400 hover:underline">
                            {topic.name}
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </React.Fragment>
            ))}
          </table>
        </div>
        {/* <aside className="flex-1 lg:flex-none lg:w-64 bg-gray-800 p-6 rounded-lg mt-6 lg:mt-0 lg:ml-6">
          <div className="mb-6">
            <h3 className="text-xl mb-4">Actions</h3>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 mb-2 rounded">
              Create New Topic
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 mb-2 rounded">
              Create New Section
            </button>
          </div>
          <div></div>
        </aside> */}
      </div>
    </div>
  )
}
