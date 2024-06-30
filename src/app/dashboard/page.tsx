import { auth } from "@clerk/nextjs/server"
import { GenerateInviteForm } from "@projectforum/components/generate-invite"
import { redirect } from "next/navigation"

export default function AdminDashboardPage() {
  // if the logged in user is a member then redirect him to home page.
  if (auth().sessionClaims?.publicMetadata?.role === "member") {
    redirect("/")
  }

  return (
    <div className=" min-w-screen min-h-screen flex flex-col items-center gap-2">
      <div className="w-full border-b mb-4">
        <div className="w-3/4 h-[120px] mx-auto flex items-center">
          <h1 className="text-bold text-2xl">Admin Dashboard</h1>
        </div>
      </div>
      <div className="w-3/4">
        <div className="grid grid-cols-4 gap-10">
          <div className="col-span-1">
            <div className="flex flex-col gap-2 border-2 w-full h-full text-sm rounded-md p-4">
              <div className="w-full p-2 rounded-md bg-accent text-accent-foreground font-bold">
                Generate Invite
              </div>
              <div className="w-full p-2 rounded-md">More Option</div>
              <div className="w-full p-2 rounded-md">More Option</div>
            </div>
          </div>
          <div className="col-span-3 p-3 rounded-md shadow-md shadow-black border-2 h-[500px]">
            <GenerateInviteForm />
          </div>
        </div>
      </div>
    </div>
  )
}
