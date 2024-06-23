import { currentUser } from "@clerk/nextjs/server"
import { SignUpWithInvite } from "./signup"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  const user = await currentUser()

  if (user) redirect("/yougood")
  return (
    <div className="flex w-screen h-screen items-center justify-center">
      <SignUpWithInvite />
    </div>
  )
}
