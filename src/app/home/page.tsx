// "use client"

// import { getAllSections } from "@projectforum/server/db/queries"
// import { useEffect, useState } from "react"

// const IndexPage = () => {
//   const [sections, setSections] = useState<
//     { id: string; name: string; createdAt: Date; updatedAt: Date | null }[]
//   >([])

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const sectionsData = await getAllSections()
//         setSections(sectionsData)
//       } catch (error) {
//         console.error("Error fetching sections:", error)
//       }
//     }

//     fetchData()
//   }, [])

//   return (
//     <div>
//       <h1>Sections</h1>
//       <ul>
//         {sections.map((section) => (
//           <li key={section.id}>{section.name}</li>
//         ))}
//       </ul>
//     </div>
//   )
// }

// export default IndexPage

import { Section } from "./Section"
// import { db } from "@projectforum/server/db"
import { getAllSections } from "@projectforum/server/db/queries"
import { createSection } from "@projectforum/server/db/queries"

// Create a new section

export default async function HomePage(props: { name: any }) {
  const newSection = {
    name: props.name,
    createdAt: new Date(),
    updatedAt: null
  }

  await createSection(newSection)
  const sections = await getAllSections()
  return <Section sections={sections} />
}
