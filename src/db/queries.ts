import { Prisma, Role } from "@prisma/client"
import { logger } from "@projectforum/lib/logger"
import { SectionWithTopics } from "@projectforum/lib/types"
import { prisma } from "@projectforum/db"
import { getThread, getReplies, getMostRecentThread } from "@prisma/client/sql"

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

export async function getRecentPost(topicId: string) {
  return await prisma.$queryRawTyped(getMostRecentThread(topicId))
}

export async function getThreadAndRepliesCount(topicId: string) {
  const threadCount = await prisma.thread.count({
    where: {
      topic_id: topicId
    }
  })

  if (threadCount === 0) {
    return {
      threadsCount: threadCount,
      repliesCount: 0
    }
  }

  const repliesCount = await prisma.thread.findMany({
    select: {
      _count: {
        select: {
          replies: true
        }
      }
    },
    where: {
      topic_id: topicId
    }
  })

  return {
    threadsCount: threadCount,
    repliesCount: repliesCount[0]?._count.replies
  }
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
  threadName = "%" + threadName.replaceAll("-", " ") + "%"
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
  interface Topic {
    id: string
    name: string
    mostRecentThread?: {
      id: string
      name: string
    }
    mostRecentThreadCreatedBy: string
    threadsCount: number
    repliesCount: number
  }

  interface Section {
    id: string
    name: string
    topics: Topic[]
  }

  const result: { sections: Section[] } = {
    sections: []
  }

  const query = await prisma.section.findMany({
    relationLoadStrategy: "join",
    select: { id: true, name: true, topics: { select: { id: true, name: true } } }
  })

  const sectionsPromises = query.map(async (section) => {
    const topicsPromises = section.topics.map(async (topic) => {
      const mostRecentThread = await getRecentPost(topic.id)
      const threadAndRepliesCount = await getThreadAndRepliesCount(topic.id)

      logger.debug(
        `name: ${topic.name}, mostRecentThread: ${mostRecentThread[0]?.name ?? null}, mostRecentThreadCreatedBy: ${mostRecentThread[0]?.repliedby ?? null}, threadsCount,: ${threadAndRepliesCount.threadsCount}, repliesCount: ${threadAndRepliesCount.repliesCount}`
      )

      return {
        id: topic.id,
        name: topic.name,
        mostRecentThread: {
          id: mostRecentThread[0]?.id ?? null,
          name: mostRecentThread[0]?.name ?? null
        },
        mostRecentThreadCreatedBy: mostRecentThread[0]?.repliedby ?? null,
        threadsCount: threadAndRepliesCount.threadsCount,
        repliesCount: threadAndRepliesCount.repliesCount
      }
    })

    const resolvedTopics = await Promise.all(topicsPromises)

    return {
      ...section,
      topics: resolvedTopics
    }
  })

  result.sections = await Promise.all(sectionsPromises)

  const endTime = performance.now()

  logger.info(`Time took to load front page: ${endTime - startTime}`)

  return result.sections
}

export async function getRepliesByThread(threadId: string) {
  return await prisma.$queryRawTyped(getReplies(threadId))
}
