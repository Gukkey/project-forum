"use client"
import { TipTapCore } from "./tiptap/tiptap-core"
import { EditorContextType } from "@projectforum/lib/types"
import { useContext } from "react"
import { EditorContext } from "@projectforum/context/editor"
import { Button } from "@shadcn/button"
import { createReply } from "@projectforum/app/actions"
import { useFormStatus } from "react-dom"

function Submit({ clearText }: { clearText: () => void }) {
  const status = useFormStatus()
  console.log(status)
  return (
    <Button
      onClick={() => {
        if (status.pending && status.method === "post") {
          clearText()
        }
      }}
      disabled={status.pending}
    >
      Submit
    </Button>
  )
}

export const ReplyForm = ({ threadId, userId }: { threadId: string; userId: string }) => {
  const { text, handleTextChange, clearText } = useContext(EditorContext) as EditorContextType
  const createReplyWithArgs = createReply.bind(this, text, threadId, userId)

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <form action={createReplyWithArgs} className="flex flex-col gap-4">
        <TipTapCore onTextChange={handleTextChange} />
        <Submit clearText={clearText} />
        <button onClick={clearText}>clear</button>
      </form>
    </div>
  )
}
