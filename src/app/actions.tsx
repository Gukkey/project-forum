"use server"

import { createSection } from "@projectforum/server/db/queries"
import { InsertSection } from "@projectforum/server/db/schema"

export async function createNewSection(formdata: FormData) {
  const data: InsertSection = {
    name: formdata.get("name") as string,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  await createSection(data)
}
