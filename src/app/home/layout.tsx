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

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname().split("/").filter(Boolean)

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
        <Breadcrumb>
          <BreadcrumbList>
            <div className="flex flex-row mx-4 px-4 pt-4">
              {pathname.map((item, idx, arr) => (
                <div key={idx}>
                  <BreadcrumbItem>
                    <BreadcrumbLink href={`/${arr.slice(0, idx + 1).join("/")}`}>
                      {item}
                    </BreadcrumbLink>
                    <BreadcrumbSeparator>
                      <Slash className="h-4 w-4 mx-1" />
                    </BreadcrumbSeparator>
                  </BreadcrumbItem>
                </div>
              ))}
            </div>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {children}
    </div>
  )
}
