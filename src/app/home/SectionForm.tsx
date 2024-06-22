// SectionForm.tsx
"use client"

import { createNewSection } from "../actions"

// import { createSection } from "@projectforum/server/db/queries"

export default function SectionForm() {
  return (
    <form action={createNewSection}>
      <input type="text" name="name" placeholder="Enter section name" />
      <button type="submit">Create Section</button>
      {/* <HomePage newSection = {newSection} /> */}
    </form>
  )
}
