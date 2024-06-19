"use client"

import React, { useState } from "react"
import HomePage from "./page"

interface SectionType {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date | null
}

export const Section = ({ sections }: { sections: SectionType[] }) => {
  const [sectionName, setSectionName] = useState("")

  const setNewSectionName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSectionName(event.target.value)
  }

  const handleCreateSection = () => {
    setSectionName(sectionName)
    setSectionName("")
  }

  return (
    <div>
      <h1>Sections</h1>
      <input
        type="text"
        value={sectionName}
        onChange={setNewSectionName}
        placeholder="Enter section name"
      />
      <button onClick={handleCreateSection}>Create Section</button>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            {section.name} {section.id} {section.createdAt.toString()}
          </li>
        ))}
      </ul>
      <HomePage name={sectionName} />
    </div>
  )
}
