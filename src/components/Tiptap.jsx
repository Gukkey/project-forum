"use client"

import Bold from "@tiptap/extension-bold"
import Link from "@tiptap/extension-link"
import Strike from "@tiptap/extension-strike"
import Underline from "@tiptap/extension-underline"
import CodeBlock from "@tiptap/extension-code-block"
import { useEditor, EditorContent } from "@tiptap/react"
import { useCallback } from "react"
import StarterKit from "@tiptap/starter-kit"
import "./Tiptap.css"

const Tiptap = ({ onTextChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https"
      }),
      Strike,
      Underline,
      CodeBlock
    ],
    injectCSS: false,
    content: "<p>Hello World! 🌎️</p>",
    onUpdate: ({ editor }) => {
      const text = editor.getHTML().toString()
      onTextChange(text)
    }
  })

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href
    const url = window.prompt("URL", previousUrl)

    // cancelled
    if (url === null) {
      return
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div>
      <div>
        <div className="control-group">
          <EditorContent editor={editor} className="editor" />
          <div className="button-group">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              italic
            </button>
            <button onClick={setLink} className={editor.isActive("link") ? "is-active" : ""}>
              Set link
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "is-active" : ""}
            >
              strike
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "is-active" : ""}
            >
              underline
            </button>
            <button
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              className={editor.isActive("codeBlock") ? "is-active" : ""}
            >
              code block
            </button>
            <button
              onClick={() => editor.chain().focus().setCodeBlock().run()}
              disabled={editor.isActive("codeBlock")}
            >
              Set code block
            </button>
            <button
              onClick={() => editor.chain().focus().unsetLink().run()}
              disabled={!editor.isActive("link")}
            >
              Unset link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tiptap
