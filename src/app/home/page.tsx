import { Section } from "@projectforum/components/section"
import { getSectionsWithTopics } from "@projectforum/db/queries"

export default async function HomePage() {
  const sectionsWithTopics = await getSectionsWithTopics()
  return (
    <div>
      <Section sections={sectionsWithTopics} />
    </div>
  )
}
