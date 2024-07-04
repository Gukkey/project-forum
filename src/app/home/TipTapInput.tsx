"use client"

import Tiptap from "@projectforum/components/Tiptap"
import { useContext } from "react"
import { EditorContext } from "@projectforum/context/editor"
import { EditorContextType } from "@projectforum/lib/types"

export default function TipTapInput() {
  const { handleTextChange } = useContext(EditorContext) as EditorContextType

  return (
    <div>
      <Tiptap onTextChange={handleTextChange} />
    </div>
  )
}
