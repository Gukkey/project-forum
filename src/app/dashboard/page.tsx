import { redirect } from "next/navigation"
import { getUserRole } from "../actions"
import { Role } from "../../lib/enums"
import { logger } from "@projectforum/lib/logger"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shadcn/tabs"
import { cn } from "@projectforum/lib/utils"
import { InviteSettings, PostSettings, RoleSettings } from "@components/admin"

export default async function AdminDashboardPage() {
  const currentlyLoggedInUserRole = await getUserRole()
  const privilege = currentlyLoggedInUserRole?.privilege as number
  logger.debug(`privilege: ${privilege}`)
  // if the logged in user is a member then redirect him to home page.
  if (currentlyLoggedInUserRole !== null) {
    if (privilege >= Role.Member) {
      redirect("/")
    }
  }

  return (
    <Tabs defaultValue="invites" className={cn("grid grid-cols-4 gap-10 h-[500px]")}>
      <TabsList className={cn("flex-col justify-start h-full col-span-1")}>
        <TabsTrigger className="w-full" value="invites">
          Invites
        </TabsTrigger>
        <TabsTrigger className="w-full" value="roles">
          Roles
        </TabsTrigger>
        <TabsTrigger className="w-full" value="posts">
          Posts
        </TabsTrigger>
      </TabsList>
      <div className="col-span-3">
        <TabsContent className={cn("flex flex-col gap-2")} value="invites">
          <InviteSettings />
        </TabsContent>
        <TabsContent value="roles">
          <RoleSettings />
        </TabsContent>
        <TabsContent value="posts">
          <PostSettings />
        </TabsContent>
      </div>
    </Tabs>
  )
}
