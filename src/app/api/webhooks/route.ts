import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { env } from "@projectforum/env"
import { createUserAfterSignUp, getRoleIdByRoleName } from "@projectforum/db/queries"

import { logger } from "@projectforum/lib/logger"

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
    const role = user.unsafe_metadata.role as "admin" | "member" | "mod"
    logger.info(`Webhook with and ID of ${user.id} and type of ${eventType}`)
    const email = user.email_addresses.find(
      (e) => e.id === user.primary_email_address_id
    )?.email_address
    const roleArray: string[] = []
    const roleId = await getRoleIdByRoleName(role)
    if (!roleId) {
      logger.debug(`roleId is undefined or null`)
      return
    } else {
      roleArray.push(roleId.id)
    }

    if (!user.username || !email) {
      logger.error("No Username or email provided")
      return
    }
    await createUserAfterSignUp({
      id: user.id,
      email,
      role_ids: roleArray,
      name: user.username,
      image_url: user.image_url
    })
    logger.info(`Created user with role ${role}`)
  }

  return new Response("", { status: 200 })
}
