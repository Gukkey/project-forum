import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default function Home() {
  // if the logged in user is a member then redirect to member home
  if (auth().sessionClaims?.publicMetadata?.role === "member") {
    redirect("/home")
  }
  // if the logged in user is an admin then redirect to dashboard
  // only admins can access dashboard
  else if (auth().sessionClaims?.publicMetadata?.role === "admin") {
    redirect("/dashboard")
  }

  // redirect to landing page if "/" is hit
  redirect("/landing")
}
