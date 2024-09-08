"use client"
import { EditorContextType } from "@projectforum/lib/types"
import { FC, ReactNode, createContext, useState } from "react"

export const EditorContext = createContext<EditorContextType | null>(null)

export const EditorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [text, setText] = useState("")

  const handleTextChange = (text: string) => {
    setText(text)
  }

  const clearText = () => {
    handleTextChange("")
  }

  return (
    <EditorContext.Provider value={{ text, handleTextChange, clearText }}>
      {children}
    </EditorContext.Provider>
  )
}
