import { getSectionsWithTopics } from "@projectforum/server/db/queries"
import { Section } from "./Section"

export default async function HomePage() {
  const sectionsWithTopics = await getSectionsWithTopics()
  return (
    <div>
      <Section sections={sectionsWithTopics} />
    </div>
  )
}
