"use client"
import { FC, ReactNode, createContext, useState } from "react"

export type EditorContextType = {
  // invite: strings
  text: string
  // setText : Dispatch<SetStateAction<boolean>>
  // eslint-disable-next-line no-unused-vars
  handleTextChange: (text: string) => void
}

export const EditorContext = createContext<EditorContextType | null>(null)

export const EditorProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [text, setText] = useState("")

  const handleTextChange = (text: string) => {
    setText(text)
  }

  return (
    <EditorContext.Provider value={{ text, handleTextChange }}>{children}</EditorContext.Provider>
  )
}
