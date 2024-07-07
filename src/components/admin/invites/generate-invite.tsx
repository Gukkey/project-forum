"use client"
import * as React from "react"
import { useState } from "react"
import { CopyIcon } from "@radix-ui/react-icons"

import { Button } from "@shadcn/button"
import { generateInviteCode } from "@projectforum/app/dashboard/helper"
import { ComboBox } from "@shadcn/combo-box"

const values = [
  {
    value: "admin",
    label: "Admin"
  },
  {
    value: "member",
    label: "Member"
  }
]

export const GenerateInviteForm = () => {
  const [value, setValue] = useState("")
  const [generatedInvite, setGeneratedInvite] = useState("")

  const onValueChange = (value: string) => {
    setGeneratedInvite("")
    setValue(value)
  }

  const generate = async () => {
    const res = await generateInviteCode(value)
    if (res.isInviteCodeGenerated && res.inviteCode) {
      setGeneratedInvite(res.inviteCode)
    }
  }

  const copyToClipboard = () => {
    window.navigator.clipboard.writeText(generatedInvite)
  }

  return (
    <div className="min-h-[200px] p-4 border-2 rounded-lg">
      <h1 className="text-xl font-bold mb-2">Generate Invite</h1>
      <p className="my-2 text-sm">Select a role to generate invite</p>

      <div className="flex my-2">
        <ComboBox comboValues={values} value={value} onValueChange={onValueChange} />
        {value !== "" && (
          <Button className="ml-2" onClick={generate}>
            Generate
          </Button>
        )}
      </div>
      {generatedInvite != "" && (
        <div className="flex my-2">
          <div className="px-2 w-[200px] rounded-md bg-accent text-accent-foreground font-extrabold text-2xl flex items-center justify-center">
            {generatedInvite}
          </div>
          <Button className="ml-2" onClick={copyToClipboard}>
            <CopyIcon />
          </Button>
        </div>
      )}
    </div>
  )
}
