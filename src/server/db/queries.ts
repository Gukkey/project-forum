import { desc, eq, sql } from "drizzle-orm"
import { db } from "."
import { cronJobLogs, discussionThreads, replies, roles, sections, topics, users } from "./schema"
import { logger } from "@projectforum/lib/logger"
import {
  InsertSection,
  InsertTopic,
  InsertDiscussionThreads,
  SelectTopic,
  SelectDiscussionThreads,
  InsertCronJobLogs,
  InsertUser,
  InsertReplies,
  SelectReplies,
  SectionWithTopics,
  InsertRole,
  SelectRole,
  SelectUser
} from "@projectforum/lib/types"

export async function createSection(data: InsertSection) {
  await db.insert(sections).values(data)
}

export async function getAllSections() {
  return await db.select({ id: sections.id, name: sections.name }).from(sections)
}

export async function createTopic(data: InsertTopic) {
  await db.insert(topics).values(data)
}

export async function createDiscussionThread(data: InsertDiscussionThreads) {
  logger.debug(data)
  await db.insert(discussionThreads).values(data)
}

export async function getAllDiscussionThreadsByTopic(id: SelectTopic["id"]) {
  return db
    .select({
      id: discussionThreads.id,
      title: discussionThreads.title,
      content: discussionThreads.content,
      userId: discussionThreads.userId
    })
    .from(discussionThreads)
    .where(eq(discussionThreads.topicId, id))
    .orderBy(desc(discussionThreads.updatedAt))
}

export async function getLatestDiscussionThread(id: SelectTopic["id"]) {
  return await db
    .select()
    .from(discussionThreads)
    .where(eq(discussionThreads.topicId, id))
    .orderBy(desc(discussionThreads.updatedAt))
    .limit(1)
}

export async function getThread(id: SelectDiscussionThreads["id"]) {
  return await db.select().from(discussionThreads).where(eq(discussionThreads.id, id))
}

export async function getSectionId(id: SelectTopic["id"]) {
  console.log(id)
  return await db.select({ sectionId: topics.sectionId }).from(topics).where(eq(topics.id, id))
}

export async function createCronJobLogs(data: InsertCronJobLogs) {
  await db.insert(cronJobLogs).values(data)
}

export async function createUserAfterSignUp(data: InsertUser) {
  await db.insert(users).values(data)
}

export async function getUserById(id: string) {
  return await db.select().from(users).where(eq(users.id, id))
}

export async function getRoleIdByRoleName(roleName: string) {
  return await db.select({ id: roles.id }).from(roles).where(eq(roles.name, roleName))
}

export async function addRole(data: InsertRole) {
  return db.insert(roles).values(data)
}

async function findAllRoles(username: string) {
  return await db
    .select({ roles: users.roles })
    .from(users)
    .where(eq(users.username, username))
    .limit(1)
}

export async function addRoleToUserInDatabase(user: { username: string; role: string }) {
  const roleArray = await findAllRoles(user.username)
  const arr = roleArray[0].roles ?? []
  arr.push(user.username)
  return db.update(users).set({ roles: arr }).where(eq(users.username, user.username))
}

export async function deleteRoleFromUserDatabase(user: { username: string; role: string }) {
  const roleArray = await findAllRoles(user.username)
  const arr = roleArray[0]?.roles
  if (arr !== null) {
    for (let i = 0; i < arr?.length; i++) {
      if (arr[i] === user.role) {
        arr.splice(i, 1)
      }
    }
  } else {
    Promise.reject(`This user has no role to remove`)
  }
  return db.update(users).set({ roles: arr }).where(eq(users.username, user.username))
}

export async function returnHighestRoleWithPrivilege(username: SelectUser["username"]) {
  try {
    if (username) {
      // return await db
      //   .select({
      //     roleName: roles.name,
      //     privilege: roles.privilege
      //   })
      //   .from(roles)
      //   .innerJoin(users, inArray(roles.id, users.roles))
      //   .where(eq(users.username, username))
      //   .orderBy(asc(roles.privilege))
      //   .limit(1)
      return await db.execute(sql`SELECT roles.name AS "roleName", roles.privilege
      FROM "example-project-1_user_roles" as roles
      INNER JOIN "example-project-1_users" as users ON roles.id = ANY(users.role_ids)
      WHERE users.name = ${username}
      ORDER BY roles.privilege ASC
      LIMIT 1`)
    }
    logger.debug(`Username is null`)
    return Promise.reject(`Username is null`)
  } catch (error) {
    logger.error(`Error while trying to query highest role: ${error}`)
    return Promise.reject(`Error while trying to query highest role: ${error}`)
  }
}

export async function getRolePrivilege(role: SelectRole["name"]) {
  return await db.select({ privilege: roles.privilege }).from(roles).where(eq(roles.name, role))
}

export async function getSectionsWithTopics(): Promise<SectionWithTopics[]> {
  const query = await db
    .select({
      sectionId: sections.id,
      sectionName: sections.name,
      topicId: topics.id,
      topicName: topics.name
    })
    .from(sections)
    .innerJoin(topics, eq(sections.id, topics.sectionId))

  const groupedResults = query.reduce((arr, idx) => {
    const section = arr.find((s) => s.id === idx.sectionId)
    if (section) {
      section.topics.push({ id: idx.topicId, name: idx.topicName })
    } else {
      arr.push({
        id: idx.sectionId,
        name: idx.sectionName,
        topics: [{ id: idx.topicId, name: idx.topicName }]
      })
    }
    return arr
  }, [] as SectionWithTopics[])

  return groupedResults
}

export async function insertReply(data: InsertReplies) {
  await db.insert(replies).values(data)
}

export async function getAllReplies(discussionThreadId: SelectReplies["discussionThreadId"]) {
  return await db
    .select({
      id: replies.id,
      content: replies.content,
      userId: replies.userId
    })
    .from(replies)
    .where(eq(replies.discussionThreadId, discussionThreadId))
    .orderBy(desc(replies.createdAt))
}
