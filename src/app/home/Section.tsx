"use client"
import { InsertTopic } from "@projectforum/server/db/schema"
import Link from "next/link"
import React from "react"

interface SectionType {
  id: string
  name: string
  topics: InsertTopic[]
}

export const Section = ({ sections }: { sections?: SectionType[] }) => {
  const handleSectionClick = () => {}

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
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
      </div>
    </div>
  )
}
