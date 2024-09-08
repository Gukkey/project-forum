"use client"

import { useContext, useRef, useState } from "react"
import { Button } from "@shadcn/button"
import { Textarea } from "@shadcn/text-area"
import { cx } from "class-variance-authority"
import { EditorContext } from "@projectforum/context/editor"
import { EditorContextType } from "@projectforum/lib/types"
import { Bold, Italic, Link, Strikethrough, Underline } from "lucide-react"
import BBcode from "@bbob/react"
import reactPreset from "@bbob/preset-react"

/**
 * Custom BBCodeEditor with a preview section.
 *
 * Enclose this editor inside of a form tag with one submit button and an action.
 *
 * Usage:
 * @example
 * ```
 * <form action={submitForm}>
 *    <BBCodeEditor/>
 *    <button type="submit">Submit</button>
 * </form>
 * ```
 *
 */
export const BBCodeEditor = () => {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
  const [selectedTab, setSelectedTab] = useState<"raw" | "preview">("raw")
  const { text, handleTextChange } = useContext(EditorContext) as EditorContextType

  const switchTab = () => {
    setSelectedTab((s) => (s === "raw" ? "preview" : "raw"))
  }

  const insertBBCode = (bbCode: string) => {
    const textArea = textAreaRef.current
    if (textArea) {
      const startIndex = textArea.selectionStart
      const endIndex = textArea.selectionEnd
      const fullText = textArea.value.replaceAll("\\n", "[br][/br]")

      const firstPart = fullText.slice(0, startIndex)
      const middlePart = fullText.slice(startIndex, endIndex)
      const endPart = fullText.slice(endIndex)

      const finalText = firstPart + "[" + bbCode + "]" + middlePart + "[/" + bbCode + "]" + endPart
      handleTextChange(finalText)
    }
  }

  return (
    <>
      <div className="bg-gray-900 border border-gray-700 rounded-md">
        <div className="flex justify-between items-center h-[38px]">
          <div className="">
            <button
              type="button"
              className={cx(
                selectedTab === "raw" && "bg-[#030711] border-r  border-gray-700",
                "p-2 text-sm rounded-t-md "
              )}
              onClick={switchTab}
            >
              Write
            </button>
            <button
              type="button"
              className={cx(
                selectedTab === "preview" && "bg-[#030711] border-x border-gray-700",
                "p-2 text-sm rounded-t-md"
              )}
              onClick={switchTab}
            >
              Preview
            </button>
          </div>
          <div className="p-1">
            {selectedTab === "raw" && (
              <>
                <Button
                  type="button"
                  size={"sm"}
                  variant="outline"
                  onClick={() => insertBBCode("b")}
                >
                  <Bold size={16} />
                </Button>
                <Button
                  type="button"
                  size={"sm"}
                  variant="outline"
                  onClick={() => insertBBCode("i")}
                >
                  <Italic size={16} />
                </Button>
                <Button
                  type="button"
                  size={"sm"}
                  variant="outline"
                  onClick={() => insertBBCode("u")}
                >
                  <Underline size={16} />
                </Button>
                <Button
                  type="button"
                  size={"sm"}
                  variant="outline"
                  onClick={() => insertBBCode("s")}
                >
                  <Strikethrough size={16} />
                </Button>
                <Button
                  type="button"
                  size={"sm"}
                  variant="outline"
                  onClick={() => insertBBCode("url")}
                >
                  <Link size={16} />
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="p-2 rounded-md h-full bg-[#030711]">
          {selectedTab === "raw" && (
            <Textarea
              className="min-h-[200px] focus-visible:ring-0 focus-visible:ring-offset-0"
              ref={textAreaRef}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
            />
          )}
          {selectedTab === "preview" && (
            <div className="min-h-[200px] px-3 py-2 border text-sm rounded-md bg-[#030711]">
              <BBcode plugins={[reactPreset()]}>{text}</BBcode>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
