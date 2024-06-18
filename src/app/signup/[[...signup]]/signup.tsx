"use client"

import { SignUp } from "@clerk/nextjs"
import { InviteForm } from "@projectforum/components/invite-form"
import { InviteContext, InviteContextType } from "@projectforum/context/invite"
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog"
import { Button } from "@shadcn/button"
import { DialogContent, DialogTitle, DialogHeader } from "@shadcn/dialog"
import { useContext } from "react"

export const SignUpWithInvite = () => {
  const { isValidInvite } = useContext(InviteContext) as InviteContextType

  return isValidInvite ? (
    <SignUp />
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
}
