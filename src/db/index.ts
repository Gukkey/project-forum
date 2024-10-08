import { PrismaClient } from "@prisma/client"
import { env } from "@projectforum/env"

const prismaClientSingleton = () => {
  return new PrismaClient({ log: ["error", "info", "warn"] })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma
