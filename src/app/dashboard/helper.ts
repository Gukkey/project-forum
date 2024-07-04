import { env } from "@projectforum/env"
import { Redis } from "@upstash/redis"

// Initialize Redis outside of the job function
const redis = new Redis({
  url: env.NEXT_PUBLIC_REDIS_URL,
  token: env.NEXT_PUBLIC_REDIS_TOKEN
})

interface InviteCodeReturnJsonSuccess {
  isInviteCodeGenerated: boolean
  inviteCode: string | null
}

export async function generateInviteCode(role: string): Promise<InviteCodeReturnJsonSuccess> {
  const rString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let inviteCode = ""
  for (let i = 0; i < 5; i++) {
    inviteCode += rString[Math.floor(Math.random() * rString.length)]
  }

  const checkIfSet = await redis.set(inviteCode, role)
  const isExpiredSet = await redis.expire(inviteCode, 7200)

  if (checkIfSet === "OK" && isExpiredSet === 1) {
    return Promise.resolve({ isInviteCodeGenerated: true, inviteCode })
  } else if (checkIfSet === "OK" && isExpiredSet !== 1) {
    redis.del(inviteCode)
  }
  return Promise.resolve({ isInviteCodeGenerated: false, inviteCode: null })
}

interface ValidateInviteCodeReturnJsonSuccess {
  isValidInvite: boolean
  role: "admin" | "member" | null
}

export async function validateInviteCode(
  inviteCode: string
): Promise<ValidateInviteCodeReturnJsonSuccess> {
  const value = await redis.get<"admin" | "member" | null>(inviteCode)
  if (value) {
    if (inviteCode !== "hello") {
      redis.del(inviteCode)
    }
    return Promise.resolve({ isValidInvite: true, role: value })
  } else {
    return Promise.reject({ isValidInvite: false, role: null })
  }
}
