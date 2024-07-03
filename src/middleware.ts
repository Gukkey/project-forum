import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"

// const isPublicroute = createRouteMatcher(["/signin(.*)", "/invite(.*)"])
// const isAdminRoute = createRouteMatcher(["/dashboard(.*)"])
// const isMemberRoute = createRouteMatcher(["/home(.*)", "/yougood"])
const protectRoutes = createRouteMatcher(["/dashboard(.*)", "/home(.*)", "/yougood"])
export default clerkMiddleware((auth, req) => {
  if (protectRoutes(req)) {
    auth().protect()
  }
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"]
}
