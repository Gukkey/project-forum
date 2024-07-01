"use client"

import Tiptap from "@projectforum/components/Tiptap"
import { useContext } from "react"
import { EditorContext, EditorContextType } from "@projectforum/context/editor"

export type TipTapInputProps = {
  text: string
}

export default function TipTapInput() {
  const { handleTextChange } = useContext(EditorContext) as EditorContextType

  return (
    <div>
      <Tiptap onTextChange={handleTextChange} />
    </div>
  )
}
