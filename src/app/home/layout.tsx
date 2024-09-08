"use client"
import { SignOutButton } from "@clerk/nextjs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@shadcn/breadcrumb"
import { Slash } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"
import { Suspense } from "react"

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <div className="sticky top-0 left-0 z-50">
        <header className="bg-[#172033] h-fit md:h-[60px] p-2 min-[640px]:px-0  flex items-center">
          <div className="w-full min-[640px]:w-[80%] min-[640px]:mx-auto">
            <div className="flex justify-between items-center">
              <div className="text-sm md:text-xl font-bold">Project Forum</div>
              <nav className="hidden md:block md:space-x-4">
                <Link href="/home" className="text-gray-300 hover:text-white">
                  Home
                </Link>

                <SignOutButton signOutOptions={{ redirectUrl: "/signin" }} />
              </nav>
            </div>
          </div>
        </header>
      </div>
      <main className="w-[80%] mx-auto mt-8">
        <Suspense fallback={<div>Loading....</div>}>
          <BreadCrumbComponent />
        </Suspense>
        <div className="mt-4">{children}</div>
      </main>
    </div>
  )
}

function BreadCrumbComponent() {
  const pathname = usePathname().split("/").filter(Boolean)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {pathname.map((item, idx, arr) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${arr.slice(0, idx + 1).join("/")}`}>{item}</BreadcrumbLink>
            </BreadcrumbItem>
            {idx !== pathname.length - 1 && (
              <BreadcrumbSeparator>
                <Slash className="h-4 w-4 mx-1" />
              </BreadcrumbSeparator>
            )}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
