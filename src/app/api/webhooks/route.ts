import { Webhook } from "svix"
import { headers } from "next/headers"
import { WebhookEvent } from "@clerk/nextjs/server"
import { env } from "@projectforum/env"
import { createUserAfterSignUp } from "@projectforum/server/db/queries"
import { InsertUser } from "@projectforum/server/db/schema"

import { logger } from "@projectforum/lib/logger"

export async function POST(req: Request) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the endpoint
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

  // Inserting user data into the vercel database
  const eventType = evt.type
  if (eventType == "user.created") {
    const user = evt.data
    logger.info(`Webhook with and ID of ${user.id} and type of ${eventType}`)
    const email = user.email_addresses.find(
      (e) => e.id === user.primary_email_address_id
    )?.email_address
    const userData = {
      id: user.id,
      email,
      name: evt.data.username ?? evt.data.first_name,
      role: "member",
      imageUrl: evt.data.image_url
    } as InsertUser

    await createUserAfterSignUp(userData)
  }

  return new Response("", { status: 200 })
}
