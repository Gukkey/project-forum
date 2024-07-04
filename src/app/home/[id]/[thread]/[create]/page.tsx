"use client"

//caa
import { createNewThread } from "@projectforum/app/actions"
// import { useParams } from "next/navigation"
import TipTapInput from "@projectforum/app/home/TipTapInput"
import { useContext } from "react"
import { EditorContext, EditorContextType } from "@projectforum/context/editor"
import "@projectforum/components/Tiptap.css"
import { logger } from "@projectforum/lib/logger"

export default function CreateThread({ params }: { params: { id: string; thread: string } }) {
  //   const sectionId = await getServerId(params.create)

  //get Section id from topic

  // const sectionId = await getSectionId(params.id)
  const { text } = useContext(EditorContext) as EditorContextType

  const createNewThreadWithText = createNewThread.bind(null, text)

  logger.debug(text)

  return (
    <div className="create-thread-page">
      <form action={createNewThreadWithText}>
        <input
          type="text"
          name="title"
          placeholder="Title of This Thread"
          className="input-field"
        />
        <div>
          <TipTapInput />
        </div>

        <input
          type="text"
          name="content"
          value={text}
          placeholder="Content of This Thread"
          className="input-field"
          hidden
        />
        <input type="hidden" name="topicId" value={params.id} />
        <input type="hidden" name="userId" value="user_2i42wcdqETahwSY5PkP1Xz4wWNw" />
        <button type="submit" className="submit-button">
          Create Thread
        </button>
      </form>
    </div>
  )
}
