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
  const [generatedInvite, setGeneratedInvite] = useState("SAMPLE")

  const onValueChange = (value: string) => setValue(value)

  const generate = async () => {
    const res = await generateInviteCode(value)
    if (res.isInviteCodeGenerated && res.inviteCode) {
      setGeneratedInvite(res.inviteCode)
    }
  }

  return (
    <div className="p-3">
      <h1 className="text-xl font-bold mb-2">Generate Invite</h1>
      <ComboBox comboValues={values} value={value} onValueChange={onValueChange} />
      {value !== "" && (
        <Button className="ml-2" onClick={generate}>
          Generate
        </Button>
      )}

      <div className="w-1/2 h-[200px] m-4 bg-accent text-accent-foreground font-extrabold text-3xl flex items-center justify-center">
        {generatedInvite}
      </div>
      <Button>
        <CopyIcon />
      </Button>
    </div>
  )
}
