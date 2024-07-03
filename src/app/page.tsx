import { redirect } from "next/navigation"
import { getUserRole } from "./actions"

export default async function Home() {
  const currentlyLoggedInUserRole = await getUserRole()

  if (currentlyLoggedInUserRole) {
    if (currentlyLoggedInUserRole === "member") {
      redirect("/home")
    }
    // if the logged in user is an admin then redirect to dashboard
    // only admins can access dashboard
    else if (currentlyLoggedInUserRole === "admin") {
      redirect("/dashboard")
    }
  }
  // redirect to landing page if "/" is hit
  redirect("/landing")
}
