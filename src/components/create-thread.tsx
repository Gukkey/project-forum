"use client"

import { createNewThread } from "@projectforum/app/actions"
import { EditorContext } from "@projectforum/context/editor"
import { EditorContextType } from "@projectforum/lib/types"
import { useContext, useState } from "react"
import { Input } from "@shadcn/input"
import { BBCodeEditor } from "./editor/editor"
import { Button } from "@shadcn/button"

export function CreateThreadForm({ topicName }: { topicName: string }) {
  const { text } = useContext(EditorContext) as EditorContextType
  const [title, setTitle] = useState<string>("")
  const createNewThreadWithContent = createNewThread.bind(null, text, topicName)
  return (
    <form action={createNewThreadWithContent}>
      <Input
        type="text"
        id="title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title of This Thread"
        className="mb-2 border bg-[#030711]"
      />
      <BBCodeEditor />

      <div className="flex">
        <Button className="w-full mt-4" disabled={text.length === 0 || title.length === 0}>
          Submit
        </Button>
      </div>
    </form>
  )
}
