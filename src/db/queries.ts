import { Prisma, Role } from "@prisma/client"
import { logger } from "@projectforum/lib/logger"
import { SectionWithTopics } from "@projectforum/lib/types"
import { prisma } from "@projectforum/db"
import { getThread, getReplies } from "@prisma/client/sql"

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

export async function getRecentPost(topicId: String) {
  const mostRecentThread = await prisma.thread.findFirst({
    select: {
      id: true,
      name: true
    },
    where: {
      topic_id: String(topicId)
    },
    orderBy: {
      updated_at: "desc"
    }
  })

  if (!mostRecentThread) {
    return {
      id: null,
      name: null,
      repliedBy: null
    }
  }

  const mostRecentReplyCreatedBy = await prisma.reply.findFirst({
    select: {
      user_id: true
    },
    where: {
      thread_id: mostRecentThread?.id
    },
    orderBy: {
      created_at: "desc"
    }
  })

  const username = await prisma.user.findFirst({
    select: {
      name: true
    },
    where: {
      id: mostRecentReplyCreatedBy?.user_id
    }
  })

  return {
    id: mostRecentThread?.id,
    name: mostRecentThread?.name,
    repliedBy: String(username?.name)
  }
}

export async function getThreadAndRepliesCount(topicId: String) {
  const threadCount = await prisma.thread.count({
    where: {
      topic_id: String(topicId)
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
      topic_id: String(topicId)
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
  interface Topic {
    id: string
    name: string
    mostRecentThread?: {
      id: string
      name: string
    }
    mostRecentThreadCreatedBy: string
    threadsCount?: number
    repliesCount?: number
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
        `name: ${topic.name}, mostRecentThread: ${mostRecentThread.name}, mostRecentThreadCreatedBy: ${mostRecentThread.repliedBy}, threadsCount,: ${threadAndRepliesCount.threadsCount}, repliesCount: ${threadAndRepliesCount.repliesCount}`
      )

      return {
        id: topic.id,
        name: topic.name,
        mostRecentThread: { id: String(mostRecentThread.id), name: String(mostRecentThread.name) },
        mostRecentThreadCreatedBy: String(mostRecentThread.repliedBy),
        threadsCount: Number(threadAndRepliesCount.threadsCount),
        repliesCount: Number(threadAndRepliesCount.repliesCount)
      }
    })

    const resolvedTopics = await Promise.all(topicsPromises)

    return {
      ...section,
      topics: resolvedTopics
    }
  })

  result.sections = await Promise.all(sectionsPromises)

  return result.sections
}

export async function getRepliesByThread(threadId: string) {
  return await prisma.$queryRawTyped(getReplies(threadId))
}
