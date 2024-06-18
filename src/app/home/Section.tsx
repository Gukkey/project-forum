"use client"

interface SectionType {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date | null
}

export const Section = ({ sections }: { sections: SectionType[] }) => {
  return (
    <div>
      <h1>Sections</h1>
      <ul>
        {sections.map((section) => (
          <li key={section.id}>{section.name}</li>
        ))}
      </ul>
    </div>
  )
}
