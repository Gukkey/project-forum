"use client"

import { SignUp } from "@clerk/nextjs"
import { InviteForm } from "@projectforum/components/invite-form"
import { InviteContext } from "@projectforum/context/invite"
import { InviteContextType } from "@projectforum/lib/types"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { Button } from "@shadcn/button"
import { DialogContent, DialogTitle, DialogHeader } from "@shadcn/dialog"
import { useContext } from "react"

export const SignUpWithInvite = () => {
  const { isValidInvite, role, inviteId } = useContext(InviteContext) as InviteContextType

  return isValidInvite ? (
    <SignUp
      unsafeMetadata={{
        role,
        inviteId
      }}
    />
  ) : (
    <div className="flex w-screen h-screen items-center justify-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline"> Sign Up</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite Code</DialogTitle>
          </DialogHeader>
          <InviteForm />
        </DialogContent>
      </Dialog>
    </div>
  )

  // return <SignUp />
}
