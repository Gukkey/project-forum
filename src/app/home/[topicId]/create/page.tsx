"use client"

//caa
import { createNewThread } from "@projectforum/app/actions"
// import { useParams } from "next/navigation"
import TipTapInput from "@projectforum/app/home/TipTapInput"
import { useContext } from "react"
import { EditorContext, EditorContextType } from "@projectforum/context/editor"
import "@projectforum/components/Tiptap.css"
// import { navigate } from "@projectforum/app/actions"

export default function CreateThread({ params }: { params: { topicId: string; thread: string } }) {
  //   const sectionId = await getServerId(params.create)

  //get Section id from topic

  // const sectionId = await getSectionId(params.id)
  const { text } = useContext(EditorContext) as EditorContextType

  const createNewThreadWithText = createNewThread.bind(null, text)

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
        <input type="hidden" name="topicId" value={params.topicId} />
        <input type="hidden" name="userId" value="user_2i42wcdqETahwSY5PkP1Xz4wWNw" />
        <button type="submit" className="submit-button">
          Create Thread
        </button>
      </form>
    </div>
  )
}
