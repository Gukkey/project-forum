"use server"
import { auth } from "@clerk/nextjs/server"
import { PrismaClient } from "@prisma/client"
import { getRoleIdByRoleName } from "@projectforum/db/queries"
// import { env } from "@projectforum/env"
// import { Redis } from "@upstash/redis"

// Initialize Redis outside of the job function
// const redis = new Redis({
//   url: env.NEXT_PUBLIC_REDIS_URL,
//   token: env.NEXT_PUBLIC_REDIS_TOKEN
// })

const prisma = new PrismaClient()

interface InviteCodeReturnJsonSuccess {
  isInviteCodeGenerated: boolean
  inviteCode: string | null
}

export async function generateInviteCode(roleName: string): Promise<InviteCodeReturnJsonSuccess> {
  const rString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
  let inviteCode = ""
  for (let i = 0; i < 5; i++) {
    inviteCode += rString[Math.floor(Math.random() * rString.length)]
  }

  const roleIdResult = await getRoleIdByRoleName(roleName)
  const userId = auth().userId
  let result = null
  if (roleIdResult && userId) {
    result = await prisma.invite.createManyAndReturn({
      data: {
        invite_code: inviteCode,
        assigned_role_id: roleIdResult.id,
        created_by: userId
      }
    })
  }
  if (result && result.length > 0) {
    return { isInviteCodeGenerated: true, inviteCode }
  } else return { isInviteCodeGenerated: false, inviteCode: null }

  // const checkIfSet = await redis.set(inviteCode, role)
  // const isExpiredSet = await redis.expire(inviteCode, 7200)

  // if (checkIfSet === "OK" && isExpiredSet === 1) {
  //   return Promise.resolve({ isInviteCodeGenerated: true, inviteCode })
  // } else if (checkIfSet === "OK" && isExpiredSet !== 1) {
  //   redis.del(inviteCode)
  // }
  // return Promise.resolve({ isInviteCodeGenerated: false, inviteCode: null })
}

interface ValidateInviteCodeReturnJsonSuccess {
  isValidInvite: boolean
  role: string | null
  inviteId: string | null
}

// To do: alter the code

// write index for invite field

export async function validateInviteCode(
  inviteCode: string
): Promise<ValidateInviteCodeReturnJsonSuccess> {
  const value = await prisma.invite.findFirst({
    where: {
      invite_code: inviteCode
    }
  })
  if (value && value.is_used === false) {
    return {
      isValidInvite: true,
      role: value.assigned_role_id,
      inviteId: value.id
    }
  } else {
    return { isValidInvite: false, role: null, inviteId: null }
  }
}
