import { SignOutButton } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"

export default async function YouGoodPage() {
  auth().protect()
  return (
    <div>
      <h1>You All Good</h1>
      <SignOutButton />
    </div>
  )
}
