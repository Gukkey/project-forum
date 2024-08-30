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
      <header className="bg-gray-650 p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Project Forum</div>
        <nav className="space-x-4">
          <Link href="/home" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            Topics
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            Community
          </Link>
          <Link href="#" className="text-gray-300 hover:text-white">
            Support
          </Link>
          <a href="#" className="text-gray-300 hover:text-white">
            Other
          </a>
          <SignOutButton signOutOptions={{ redirectUrl: "/signin" }} />
        </nav>
      </header>
      <div>
        <Suspense fallback={<div>Loading....</div>}>
          <BreadCrumbComponent />
        </Suspense>
      </div>
      {children}
    </div>
  )
}

function BreadCrumbComponent() {
  const pathname = usePathname().split("/").filter(Boolean)
  return (
    <Breadcrumb>
      <BreadcrumbList className="mx-4 px-4 pt-4">
        {pathname.map((item, idx, arr) => (
          <React.Fragment key={idx}>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/${arr.slice(0, idx + 1).join("/")}`}>{item}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <Slash className="h-4 w-4 mx-1" />
            </BreadcrumbSeparator>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
