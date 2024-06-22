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
    <div className="p-4 overflow-x-auto">
      <h1 className="text-2xl font-bold text-left mb-6">Sections</h1>
      <table className="min-w-full table-auto">
        {sections?.map((section) => (
          <React.Fragment key={section.id}>
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xl" onClick={handleSectionClick}>
                  {section.name}
                </th>
              </tr>
            </thead>
            <tbody>
              {section.topics.length === 0 ? (
                <tr>
                  <td className="px-4 py-2">No topics found</td>
                </tr>
              ) : (
                section.topics.map((topic) => (
                  <tr key={topic.id} className="border-t">
                    <td className="px-4 py-2">
                      <Link
                        href={`home/page/${topic.id}`}
                        className="text-blue-400 hover:underline"
                      >
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
  )
}
