"use client"

import { GenerateInviteForm } from "@projectforum/components/generate-invite"
import { redirect } from "next/navigation"
import { getUserRole } from "../actions"
import { useState, useEffect } from "react"
import { Role } from "../../lib/enums"
import { logger } from "@projectforum/lib/logger"
import * as ToggleGroup from "@radix-ui/react-toggle-group"
import { SignOutButton } from "@clerk/nextjs"
import Addsection from "../../components/AddSection"

async function checkUserRole() {
  const currentlyLoggedInUserRole = await getUserRole()
  const privilege = currentlyLoggedInUserRole?.privilege as number

  logger.debug(`privilege: ${privilege}`)

  if (currentlyLoggedInUserRole !== null && privilege >= Role.Member) {
    redirect("/")
  }
}

export default function AdminDashboardPage() {
  const [curTab, setCurTab] = useState("generate")

  useEffect(() => {
    checkUserRole()
  }, [])

  const handleChange = (value: string) => {
    if (value) {
      setCurTab(value)
    }
  }

  return (
    <div
      className="min-w-screen min-h-screen flex flex-col items-center gap-2"
      style={{ backgroundColor: "#111827" }}
    >
      <div className="w-full border-b mb-4">
        <div className="w-3/4 h-[120px] mx-auto flex items-center justify-between">
          <h1 className="text-bold text-2xl">Admin Dashboard</h1>
          <SignOutButton />
        </div>
      </div>
      <div className="w-3/4">
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-1">
            <ToggleGroup.Root
              className="flex flex-col gap-2 border-2 w-full h-full text-sm rounded-md p-4 ToggleGroup"
              onValueChange={handleChange}
              value={curTab}
              type="single"
            >
              <ToggleGroup.Item
                value="generate"
                className={`w-full p-2 rounded-md ${
                  curTab === "generate" ? "bg-accent text-accent-foreground font-bold" : ""
                } ToggleGroupItem`}
              >
                Generate Invite
              </ToggleGroup.Item>
              <ToggleGroup.Item
                value="add"
                className={`w-full p-2 rounded-md ${
                  curTab === "add" ? "bg-accent text-accent-foreground font-bold" : ""
                } ToggleGroupItem`}
              >
                Add Section/Topics
              </ToggleGroup.Item>
            </ToggleGroup.Root>
          </div>
          <div className="col-span-3 p-3 rounded-md shadow-md shadow-black border-2 h-[500px]">
            {curTab === "generate" && <GenerateInviteForm />}
            {curTab === "add" && (
              <div>
                <Addsection />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
