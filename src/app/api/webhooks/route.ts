import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { env } from "@projectforum/env"
import { createUserAfterSignUp } from "@projectforum/db/queries"

import { logger } from "@projectforum/lib/logger"
import { prisma } from "@projectforum/db"
// import { redirect } from "next/navigation"

export async function POST(req: Request) {
  const WEBHOOK_SECRET = env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local")
  }

  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature
    }) as WebhookEvent
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occured", {
      status: 400
    })
  }

  // Inserting user data into the database
  const eventType = evt.type
  if (eventType == "user.created") {
    const user = evt.data
    const role = user.unsafe_metadata.role as string
    const inviteId = user.unsafe_metadata.inviteId as string
    logger.info(`Webhook with and ID of ${user.id} and type of ${eventType}`)
    const email = user.email_addresses.find(
      (e) => e.id === user.primary_email_address_id
    )?.email_address

    logger.debug(`Role ID: ${role}, inviteId: ${inviteId}`)

    // first take the role id from the invite table

    const inviteCodeRecord = await prisma.invite.findFirst({
      where: {
        id: inviteId
      }
    })

    const userId = user.id
    try {
      if (!user.username || !email) {
        logger.error("No Username or email provided")
        return
      }

      await createUserAfterSignUp({
        id: user.id,
        email,
        name: user.username,
        image_url: user.image_url
      })

      // push the info to user role table, then update invites table
      await prisma.userRole.create({
        data: {
          role_id: String(inviteCodeRecord?.assigned_role_id),
          user_id: String(user.id)
        }
      })

      await prisma.invite.update({
        where: {
          id: inviteId
        },
        data: {
          is_used: true,
          used_by: userId,
          used_on: new Date(Date.now())
        }
      })
      logger.info(`Created user with role ${role}`)
    } catch (error) {
      logger.error(error, "Inside catch")
      // await clerkClient.users.deleteUser(userId)
      // await prisma.user.delete({ where: { id: userId } })
      return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 })
    }
    // redirect("/")
  }

  return new Response("", { status: 200 })
}
