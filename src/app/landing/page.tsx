import { Button } from "@shadcn/button"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function LandingPage() {
  const user = await currentUser()
  if (user) redirect("/")
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className=" font-bold text-6xl text-center mb-6">Project Forum</h1>
      <div className="flex space-x-4">
        <Link href="/signin">
          <Button>Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button>Sign Up</Button>
        </Link>
      </div>
    </div>
  )
}
