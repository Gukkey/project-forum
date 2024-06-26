import { clerkMiddleware } from "@clerk/nextjs/server"

// const isPublicroute = createRouteMatcher(["/signin(.*)", "/invite(.*)"])

export default clerkMiddleware()

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
