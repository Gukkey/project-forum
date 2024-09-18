import { Prisma, Role } from "@prisma/client"
import { logger } from "@projectforum/lib/logger"
import { SectionWithTopics } from "@projectforum/lib/types"
import { prisma } from "@projectforum/db"
import { getThread, getReplies, getFrontPageStats } from "@prisma/client/sql"

export async function createSection(data: Prisma.SectionCreateInput) {
  return await prisma.section.create({ data })
}

export async function getAllSections() {
  return await prisma.section.findMany({ select: { id: true, name: true } })
}

export async function getSectionById(id: string) {
  return await prisma.section.findUnique({ where: { id: id } })
}

export async function createTopic(data: Prisma.TopicUncheckedCreateInput) {
  return await prisma.topic.create({ data })
}

export async function createDiscussionThread(data: Prisma.ThreadUncheckedCreateInput) {
  logger.info(`userid: ${data.user_id}`)
  return await prisma.thread.create({ data })
}

export async function updateThread(data: Prisma.ThreadUncheckedUpdateInput) {
  return await prisma.thread.update({
    where: {
      id: String(data.id)
    },
    data: data
  })
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
  logger.info(`thread name: ${threadName}`)
  threadName = threadName.replaceAll("-", " ")
  return await prisma.$queryRawTyped(getThread(threadName))
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

export async function createNewReply(data: Prisma.ReplyUncheckedCreateInput) {
  return await prisma.reply.create({ data })
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
  const startTime = performance.now()
  const optimisedQuery = await prisma.$queryRawTyped(getFrontPageStats())

  const sectionMap = new Map<string, SectionWithTopics>()

  optimisedQuery.forEach((section) => {
    logger.info(section)

    if (!sectionMap.has(section.section_id)) {
      sectionMap.set(section.section_id, {
        id: section.section_id,
        name: section.section_name,
        topics: []
      })
    }

    const sectionData = sectionMap.get(section.section_id)!
    sectionData.topics.push({
      id: section.topic_id,
      name: section.topic_name,
      mostRecentThread: {
        id: section.latest_thread_id,
        name: section.latest_thread_name,
        repliedOrCreatedBy: section.last_reply_by ?? section.latest_thread_created_by
      },
      threadsCount: Number(section.thread_count),
      repliesCount: Number(section.reply_count)
    })
  })

  const res = Array.from(sectionMap.values())

  const endTime = performance.now()
  logger.info(`Time took to load front page: ${endTime - startTime}`)
  return res
}

export async function getRepliesByThread(threadId: string) {
  return await prisma.$queryRawTyped(getReplies(threadId))
}
