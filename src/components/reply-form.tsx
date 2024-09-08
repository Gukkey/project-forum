"use client"
import { EditorContextType } from "@projectforum/lib/types"
import { useContext, useState } from "react"
import { EditorContext } from "@projectforum/context/editor"
import { Button } from "@shadcn/button"
import { createReply } from "@projectforum/app/actions"
import { BBCodeEditor } from "./editor/editor"

export const ReplyForm = ({
  threadId,
  userId,
  threadName,
  topicName
}: {
  threadId: string
  userId: string
  threadName: string
  topicName: string
}) => {
  const { text, clearText } = useContext(EditorContext) as EditorContextType
  const [disableForm, setDisableForm] = useState(false)
  const createReplyWithArgs = createReply.bind(this, text, threadId, userId, threadName, topicName)

  const handleSubmit = () => {
    setDisableForm(true)
    clearText()
    setDisableForm(false)
  }

  return (
    <div className="">
      <form action={createReplyWithArgs} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <BBCodeEditor />
        <Button disabled={text.length === 0 || disableForm} type="submit">
          Submit
        </Button>
      </form>
    </div>
  )
}
