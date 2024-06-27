import { Redis } from "@upstash/redis"

// Initialize Redis outside of the job function
const redis = new Redis({
  url: process.env.REDIS_URL,
  token: process.env.REDIS_TOKEN
})

interface InviteCodeReturnJsonSuccess {
  isInviteCodeGenerated: boolean
  inviteCode: string
}

type InviteCodeReturnJsonFailure = Omit<InviteCodeReturnJsonSuccess, "inviteCode">

export async function generateInviteCode(
  role: string
): Promise<InviteCodeReturnJsonSuccess | InviteCodeReturnJsonFailure> {
  const rString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let inviteCode = ""
  for (var i = 0; i < 5; i++) {
    inviteCode += rString[Math.floor(Math.random() * rString.length)]
  }

  const checkIfSet = await redis.set(inviteCode, role)
  const isExpiredSet = await redis.expire(inviteCode, 7200)

  let returnJson: InviteCodeReturnJsonSuccess | InviteCodeReturnJsonFailure = {
    isInviteCodeGenerated: false
  }

  if (checkIfSet === "OK" && isExpiredSet === 1) {
    returnJson = {
      isInviteCodeGenerated: true,
      inviteCode: inviteCode
    }
  } else if (checkIfSet === "OK" && isExpiredSet !== 1) {
    redis.del(inviteCode)
  }

  return Promise.resolve(returnJson)
}

interface ValidateInviteCodeReturnJsonSuccess {
  isValidInvite: boolean
  role: string
}

type ValidateInviteCodeReturnJsonFalse = Omit<ValidateInviteCodeReturnJsonSuccess, "role">

export async function validateInviteCode(
  inviteCode: string
): Promise<ValidateInviteCodeReturnJsonSuccess | ValidateInviteCodeReturnJsonFalse> {
  let returnJson: ValidateInviteCodeReturnJsonSuccess | ValidateInviteCodeReturnJsonFalse = {
    isValidInvite: false
  }

  const value = await redis.get(inviteCode)
  if (value) {
    returnJson = {
      isValidInvite: true,
      role: String(value)
    }
    if (inviteCode !== "hello") {
      redis.del(inviteCode)
    }
    return Promise.resolve(returnJson)
  } else {
    return Promise.reject(returnJson)
  }
}
