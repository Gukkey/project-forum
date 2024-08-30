"use client"

import { createNewThread } from "@projectforum/app/actions"
import { EditorContext } from "@projectforum/context/editor"
import { EditorContextType } from "@projectforum/lib/types"
import { useContext } from "react"
import { TipTapCore } from "./tiptap/tiptap-core"
import { Input } from "@shadcn/input"

export function CreateThreadForm({ topicName }: { topicName: string }) {
  const { text, handleTextChange } = useContext(EditorContext) as EditorContextType
  const createNewThreadWithContent = createNewThread.bind(null, text, topicName)
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <form action={createNewThreadWithContent}>
        <div>
          <Input
            type="text"
            id="title"
            name="title"
            placeholder="Title of This Thread"
            className="mb-2 border-2 border-gray-900"
          />
        </div>
        <TipTapCore onTextChange={handleTextChange} />
      </form>
    </div>
  )
}
