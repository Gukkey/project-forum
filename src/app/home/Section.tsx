"use client"

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
    <div>
      <h1>Sections</h1>
      {sections?.map((section) => (
        <div key={section.id}>
          <h2 onClick={handleSectionClick}>{section.name}</h2>
          {section.topics.length === 0 && <p>No topics found</p>}
          <ul>
            {section.topics.map((topic) => (
              <li key={topic.id}>
                {topic.name} - Created At: {topic.createdAt.toLocaleDateString()}
                <ul>
                  {topic.threads.length === 0 && <li>No threads found</li>}
                  {topic.threads.map((thread) => (
                    <li key={thread.id}>
                      {thread.title} - Created At: {thread.createdAt.toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
