// import { GenerateInviteForm } from "@projectforum/components/generate-invite"
import { redirect } from "next/navigation"
import { getUserRole } from "../actions"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "dashboard",
  description: "admin dashboard for admin activities"
}

export default async function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const currentlyLoggedInUserRole = await getUserRole()
  // if the logged in user is a member then redirect him to home page.
  if (currentlyLoggedInUserRole === "member") {
    redirect("/")
  }

  return (
    <div className=" min-w-screen min-h-screen flex flex-col items-center gap-2">
      <div className="w-full border-b mb-4">
        <div className="w-3/4 h-[120px] mx-auto flex items-center">
          <h1 className="text-bold text-2xl">Admin Dashboard</h1>
        </div>
      </div>
      <div className="w-3/4">{children}</div>
    </div>
  )
}
