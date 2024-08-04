/* eslint-disable no-unused-vars */
"use client"

import Link from "@tiptap/extension-link"
import Underline from "@tiptap/extension-underline"
import { useEditor, EditorContent } from "@tiptap/react"
import { FormEvent } from "react"
import StarterKit from "@tiptap/starter-kit"
import { Button } from "@shadcn/button"
import { cn } from "@projectforum/lib/utils"

// import {StarterKit} from "@tiptap/starter-kit"
// import "./Tiptap.css"

// eslint-disable-next-line no-unused-vars
export const TipTapCore = ({ onTextChange }: { onTextChange: (text: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true
      }),
      Underline
    ],
    injectCSS: false,
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getHTML().toString()
      onTextChange(text)
    }
  })

  Link.extend({ inclusive: true })

  if (!editor) {
    return null
  }

  const handleClick = (ev: FormEvent, mark: string) => {
    ev.preventDefault()
    if (editor) {
      if (mark === "link") {
        const previousUrl = editor.getAttributes("link").href
        const url = window.prompt("URL", previousUrl)
        // cancelled
        if (url === null) {
          return
        }

        editor
          .chain()
          .focus()
          .extendMarkRange("link")
          .setLink({ href: "https://jojo.fandom.com/wiki/Morioh" })
          .run()
      } else if (mark === "unsetlink") {
        editor.chain().focus().unsetLink().run()
      }
      editor.chain().focus().toggleMark(mark).run()
    }
  }

  const marks = ["bold", "italic", "underline", "code"]

  return (
    <div>
      <div>
        <div className="control-group">
          <EditorContent
            editor={editor}
            className="border-2 rounded-md min-h-[120px] mb-2 border-gray-900 px-3 py-1 text-sm outline-none"
          />
          <div className="mb-2">
            {marks.map((mark, i) => (
              <Button
                key={i}
                size="sm"
                variant="secondary"
                onClick={(e) => handleClick(e, mark)}
                className={cn(editor.isActive(mark) ? "bg-gray-950" : "", "mr-1")}
              >
                {mark}
              </Button>
            ))}
          </div>

          <Button className="w-full"> Create Thread</Button>
        </div>
      </div>
    </div>
  )
}
