import { PrismaClient } from "@prisma/client"
import { logger } from "../src/lib/logger"

const prisma = new PrismaClient()

async function main() {
  const roles = await prisma.role.createManyAndReturn({
    data: [
      {
        name: "admin",
        privilege: 1
      },
      {
        name: "mod",
        privilege: 5
      },
      {
        name: "member",
        privilege: 10
      }
    ]
  })

  logger.debug("::::::::::::::::: ROLES CREATED :::::::::::::::::")
  logger.debug({ roles })

  const users = await prisma.user.createManyAndReturn({
    data: [
      {
        id: "user_2jpTXGTq9ps1UDFNQXvpL5N0AVf",
        email: "forumadmin@yopmail.com",
        name: "forumadmin"
      },
      {
        id: "user_2jpTQe6NEo9JvCv4R3yTH01h5NJ",
        email: "forummod@yopmail.com",
        name: "forummod"
      },
      {
        id: "user_2jpTaRc3DGT6H8JDK1gWoGYglH3",
        email: "forummember@yopmail.com",
        name: "forummember"
      }
    ]
  })

  logger.debug("::::::::::::::::: USERS CREATED :::::::::::::::::")
  logger.debug({ users })

  const sections = await prisma.section.createManyAndReturn({
    data: [{ name: "Media" }, { name: "Tech" }]
  })

  logger.debug("::::::::::::::::: SECTIONS CREATED :::::::::::::::::")
  logger.debug({ sections })

  const topics = await prisma.topic.createManyAndReturn({
    data: [
      {
        name: "Anime",
        section_id: sections.find((s) => s.name === "Media")?.id as string
      },
      {
        name: "Movies",
        section_id: sections.find((s) => s.name === "Media")?.id as string
      },
      {
        name: "Java",
        section_id: sections.find((s) => s.name === "Tech")?.id as string
      }
    ]
  })

  logger.debug("::::::::::::::::: TOPICS CREATED :::::::::::::::::")
  logger.debug({ topics })

  const threads = await prisma.thread.createManyAndReturn({
    data: [
      {
        name: "Is One Piece the Greatest Piece of Fiction?",
        content: "YES",
        section_id: sections.find((s) => s.name === "Media")?.id as string,
        topic_id: topics.find((t) => t.name === "Anime")?.id as string,
        user_id: users.find((u) => u.name === "forummember")?.id as string
      }
    ]
  })

  logger.debug("::::::::::::::::: THREADS CREATED :::::::::::::::::")
  logger.debug({ threads })

  const userroles = await prisma.userRole.createManyAndReturn({
    data: [
      {
        user_id: users.find((u) => u.name === "forumadmin")?.id as string,
        role_id: roles.find((r) => r.name === "admin")?.id as string
      },
      {
        user_id: users.find((u) => u.name === "forummod")?.id as string,
        role_id: roles.find((r) => r.name === "mod")?.id as string
      },
      {
        user_id: users.find((u) => u.name === "forummember")?.id as string,
        role_id: roles.find((r) => r.name === "member")?.id as string
      }
    ]
  })

  logger.debug("::::::::::::::::: USERROLES CREATED :::::::::::::::::")
  logger.debug({ userroles })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    logger.error(e)

    await prisma.$disconnect()
    process.exit(1)
  })
