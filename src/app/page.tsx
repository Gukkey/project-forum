import { redirect } from "next/navigation"
import { getUserRole } from "./actions"
import { Role } from "@projectforum/lib/enums"
import { logger } from "@projectforum/lib/logger"

export default async function Home() {
  const currentlyLoggedInUserRole = await getUserRole()

  logger.debug(currentlyLoggedInUserRole, `HOMEPAGE, route ('/'), currentlyLoggedInUserRole ::`)
  if (currentlyLoggedInUserRole) {
    const { privilege } = currentlyLoggedInUserRole
    if (privilege !== null) {
      if (privilege >= Role.Member) {
        redirect("/home")
      }
      // if the logged in user is an admin then redirect to dashboard
      // only admins can access dashboard
      else if (privilege <= Role.Admin) {
        redirect("/dashboard")
      }
    }
  } else {
    redirect("/landing")
  }
  // redirect to landing page if "/" is hit
}
