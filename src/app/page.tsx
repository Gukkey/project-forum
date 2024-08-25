import { redirect } from "next/navigation"
import { getUserRole } from "./actions"
import { Role } from "@projectforum/lib/enums"
import { logger } from "@projectforum/lib/logger"
import { auth } from "@clerk/nextjs/server"

export default async function Home() {
  const user = auth().userId
  if (!user) redirect("/landing")

  const currentlyLoggedInUserRole = await getUserRole()
  if (currentlyLoggedInUserRole) {
    logger.debug(
      currentlyLoggedInUserRole.privilege,
      `HOMEPAGE, route ('/'), currentlyLoggedInUserRole ::`
    )
    const { privilege } = currentlyLoggedInUserRole
    if (privilege) {
      if (privilege >= Role.Member) {
        redirect("/home")
      }
      // if the logged in user is an admin then redirect to dashboard
      // only admins can access dashboard
      else if (privilege <= Role.Admin) {
        redirect("/dashboard")
      }
    }
  }
  // redirect to landing page if "/" is hit
}
