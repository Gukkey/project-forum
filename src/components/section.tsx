"use client"
import { createRouteFromString } from "@projectforum/app/home/helper"
import { SectionWithTopics } from "@projectforum/lib/types"
import Link from "next/link"
import React from "react"

export const Section = ({ sections }: { sections?: SectionWithTopics[] }) => {
  const handleSectionClick = () => {}

  return (
    <div className="bg-gray-900 text-gray-300">
      <div className="flex flex-col lg:flex-row">
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
                          <Link
                            href={`home/${createRouteFromString(topic.name)}`}
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
      </div>
    </div>
  )
}
