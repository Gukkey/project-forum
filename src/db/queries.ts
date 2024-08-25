import { PrismaClient, Prisma, Role } from "@prisma/client"
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

export async function getTopicById(topicId: string) {
  return await prisma.topic.findUnique({ where: { id: topicId } })
}

export async function createDiscussionThread(data: Prisma.ThreadUncheckedCreateInput) {
  return await prisma.thread.create({ data })
}

export async function getAllDiscussionThreads(id: string) {
  return await prisma.thread.findMany({
    select: {
      id: true,
      name: true,
      content: true,
      user: true
    },
    where: {
      topic_id: id
    },
    orderBy: {
      updated_at: "desc"
    }
  })
}

export async function getLatestDiscussionThread(id: string) {
  return await prisma.thread.findFirst({ where: { id }, orderBy: { updated_at: "desc" } })
}

export async function getDiscussionThread(id: string) {
  return await prisma.thread.findMany({ where: { id } })
}

export async function getSectionIdByTopicId(id: string) {
  return await prisma.topic.findUnique({ select: { section_id: true }, where: { id } })
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

// async function getAllRolesByUser(user_id: string) {
//   return await prisma.user.findFirst({ select: { role_ids: true }, where: { id: user_id } })
// }

export async function addRoleToUser(data: { user_id: string; role_id: string }) {
  return await prisma.userRole.create({ data })
}

export async function deleteRoleFromUser(data: { user_id: string; role_id: string }) {
  return await prisma.userRole.deleteMany({
    where: { role_id: data.user_id, user_id: data.user_id }
  })
  // const rolesResult = await getAllRolesByUser(user_id)
  // const roles = rolesResult?.role_ids ?? []

  // if (roles.length == 0) {
  //   throw new Error("This user does not have any roles")
  // }

  // const updatedRoles = roles.filter((r) => r != role_id)
  // return await prisma.user.update({ where: { id: user_id }, data: { role_ids: updatedRoles } })
}

export async function returnHighestRoleWithPrivilege(userid: string) {
  // const result = await prisma.$queryRaw<Role[]>`
  //       select roles.name as name, roles.id as id, privilege from roles
  //       inner join users on roles.id = ANY(users.role_ids)
  //       where users.id = ${userid}
  //       order by roles.privilege ASC
  //       limit 1;
  //       `
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
  // const query = await db
  //   .select({
  //     sectionId: sections.id,
  //     sectionName: sections.name,
  //     topicId: topics.id,
  //     topicName: topics.name
  //   })
  //   .from(sections)
  //   .innerJoin(topics, eq(sections.id, topics.sectionId))

  // const groupedResults = query.reduce((arr, idx) => {
  //   const section = arr.find((s) => s.id === idx.id)
  //   if (section) {
  //     section.topics.push({ id: idx.topicId, name: idx.topicName })
  //   } else {
  //     arr.push({
  //       id: idx.sectionId,
  //       name: idx.sectionName,
  //       topics: [{ id: idx.topicId, name: idx.topicName }]
  //     })
  //   }
  //   return arr
  // }, [] as SectionWithTopics[])

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
