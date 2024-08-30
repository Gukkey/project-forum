import { PrismaClient, Prisma, Role } from "@prisma/client"
import { logger } from "@projectforum/lib/logger"
import { SectionWithTopics } from "@projectforum/lib/types"

const prisma = new PrismaClient()

export async function createSection(data: Prisma.SectionCreateInput) {
  return await prisma.section.create({ data })
}

export async function getAllSections() {
  return await prisma.section.findMany({ select: { id: true, name: true } })
}

export async function createTopic(data: Prisma.TopicCreateInput) {
  return await prisma.topic.create({ data })
}

export async function createDiscussionThread(data: Prisma.ThreadUncheckedCreateInput) {
  logger.info(`userid: ${data.user_id}`)
  return await prisma.thread.create({ data })
}

export async function getAllDiscussionThreads(topicName: string) {
  return await prisma.thread.findMany({
    include: {
      topic: true
    },
    where: {
      topic: {
        name: {
          mode: "insensitive",
          equals: topicName
        }
      }
    }
  })
}

export async function getTopicByTopicName(topicName: string) {
  return await prisma.topic.findFirst({
    where: {
      name: {
        mode: "insensitive",
        equals: topicName
      }
    }
  })
}

export async function getDiscussionThread(threadName: string) {
  threadName = threadName.replaceAll("-", " ")
  logger.info(`thread name: ${threadName}`)
  return await prisma.thread.findMany({
    where: {
      name: {
        mode: "insensitive",
        contains: threadName
      }
    }
  })
}

export async function getSectionIdByTopicName(name: string) {
  return await prisma.topic.findUnique({
    select: {
      section_id: true
    },
    where: {
      name: name
    }
  })
}

export async function createCronJobLogs(data: Prisma.CronJobLogsCreateInput) {
  return await prisma.cronJobLogs.create({ data })
}

export async function createUserAfterSignUp(data: Prisma.UserCreateInput) {
  return await prisma.user.create({ data })
}

export async function getDiscussionThreadByTitle(title: string) {
  return await prisma.thread.findMany({ where: { name: title } })
}
export async function getUserById(id: string) {
  return await prisma.user.findUnique({ where: { id } })
}

export async function getRoleIdByRoleName(roleName: string) {
  return await prisma.role.findUnique({ select: { id: true }, where: { name: roleName } })
}

export async function createNewRole(data: Prisma.RoleCreateInput) {
  return await prisma.role.create({ data })
}

export async function addRoleToUser(data: { user_id: string; role_id: string }) {
  return await prisma.userRole.create({ data })
}

export async function deleteRoleFromUser(data: { user_id: string; role_id: string }) {
  return await prisma.userRole.deleteMany({
    where: { role_id: data.user_id, user_id: data.user_id }
  })
}

export async function returnHighestRoleWithPrivilege(userid: string) {
  const result = await prisma.$queryRaw<Pick<Role, "privilege">[]>`
          select
          b.privilege 
        from
          users a,
          roles b,
          user_roles c
        where
          a.id = c.user_id
          and b.id = c.role_id 
          and a.id = ${userid}
        order by b.privilege
        limit  1;
  `
  return result[0]
}

export async function getRolePrivilegeByName(roleName: string) {
  return await prisma.role.findFirst({ select: { privilege: true }, where: { name: roleName } })
}

export async function getRoleByName(roleName: string) {
  return await prisma.role.findFirst({ where: { name: roleName } })
}

export async function getSectionsWithTopics(): Promise<SectionWithTopics[]> {
  const query = await prisma.section.findMany({
    relationLoadStrategy: "join",
    select: { id: true, name: true, topics: { select: { id: true, name: true } } }
  })
  return query
}

export async function insertReply(data: Prisma.ReplyCreateInput) {
  return await prisma.reply.create({ data })
}

export async function getAllReplies(discussionThreadId: string) {
  return await prisma.reply.findMany({
    where: { thread_id: discussionThreadId },
    orderBy: { created_at: "desc" }
  })
}
