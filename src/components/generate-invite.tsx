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

  const generate = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.target as HTMLButtonElement
    button.disabled = true
    const res = await generateInviteCode(value)
    if (res.isInviteCodeGenerated && res.inviteCode) {
      setGeneratedInvite(res.inviteCode)
    }
  }

  const copyInvite = () => {
    navigator.clipboard.writeText(generatedInvite)
  }

  return (
    <div className="p-3 h-full">
      <h1 className="text-xl font-bold mb-2 h-1/6">Generate Invite</h1>
      <div className="flex flex-col justify-center items-center h-5/6">
        <div className="flex flex-col justify-center items-center">
          <div className="flex justify-center items-center">
            <ComboBox comboValues={values} value={value} onValueChange={onValueChange} />{" "}
            <Button disabled={generatedInvite === "SAMPLE"} className="ml-2" onClick={copyInvite}>
              <CopyIcon />
            </Button>
          </div>
          {value !== "" && (
            <div className="flex mt-2">
              <Button className="ml-2" onClick={(event) => generate(event)}>
                Generate
              </Button>
            </div>
          )}
        </div>

        {generatedInvite !== "SAMPLE" && (
          <div className="w-1/2 h-[100px] rounded-xl m-4 bg-accent text-accent-foreground font-extrabold text-3xl flex items-center justify-center">
            {generatedInvite}
          </div>
        )}
      </div>
    </div>
  )
}
