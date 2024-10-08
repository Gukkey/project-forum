"use server"

import { logger } from "@projectforum/lib/logger"
import { auth, currentUser } from "@clerk/nextjs/server"
import { notFound, redirect } from "next/navigation"
import {
  returnHighestRoleWithPrivilege,
  getUserById,
  createDiscussionThread,
  createNewRole,
  addRoleToUser,
  getRoleByName,
  deleteRoleFromUser,
  createSection,
  getTopicByTopicName,
  createNewReply,
  getDiscussionThread,
  createTopic,
  updateThread
} from "@projectforum/db/queries"
import { Prisma } from "@prisma/client"

export async function createNewSection(formdata: FormData) {
  const data: Prisma.SectionCreateInput = {
    name: formdata.get("name") as string
  }
  await createSection(data)
}

export async function createNewTopic(formData: FormData) {
  const data: Prisma.TopicUncheckedCreateInput = {
    name: formData.get("name") as string,
    section_id: formData.get("section_id") as string
  }
  await createTopic(data)
}

export async function createNewThread(text: string, topicName: string, formdata: FormData) {
  // Check if content is empty
  if (!text.trim()) {
    logger.error(" Content is empty ")
    return // Exit the function early
  }

  if (text === "<p></p>") {
    logger.error(" Content is empty ")
    return // Exit the function early
  }
  // const topicId = formdata.get("topicId") as string
  const topic = await getTopicByTopicName(topicName)
  const sectionId = topic?.section_id
  const user = await currentUser()
  logger.debug(text)
  const name = formdata.get("title")

  if (!name && name?.length == 0) {
    logger.error("Title is empty")
    return
  }
  if (sectionId && user) {
    const topicId = topic.id

    const data: Prisma.ThreadUncheckedCreateInput = {
      name: name as string,
      content: text,
      section_id: sectionId,
      topic_id: topicId,
      user_id: user.id
    }
    await createDiscussionThread(data)
    redirect(`/home/${topicName}`)
  }
}

export async function createReply(
  text: string,
  threadId: string,
  userId: string,
  threadName: string,
  topicName: string,
  formData: FormData
) {
  // Check if content is empty
  if (!text.trim()) {
    logger.error(" Content is empty ")
    return // Exit the function early
  }

  const threadData: Prisma.ThreadUncheckedUpdateInput = {
    id: threadId,
    updated_at: new Date().toISOString()
  }

  const data: Prisma.ReplyUncheckedCreateInput = {
    content: text,
    thread_id: threadId,
    user_id: userId
  }
  logger.debug(formData.get("editor"))
  await createNewReply(data)
  await updateThread(threadData)
  redirect(`/home/${topicName}/${threadName}`)
}

export async function getUserRole() {
  const userId = auth().userId
  if (!userId) return null

  logger.debug(userId)
  const userData = await getUserById(userId)
  logger.debug(`getUserRole() :: Current User ${userData?.id}`)
  if (userData) {
    const userPrivilegeData = await returnHighestRoleWithPrivilege(userData.id)
    logger.debug(userPrivilegeData, "getUserRole() :: userPrivilegeData")
    return userPrivilegeData
  }
  return null
}

export async function addRoleWithPrivilege(
  roleName: string,
  rolePrivilege: number,
  currentUsername: string
) {
  const { privilege } = await returnHighestRoleWithPrivilege(currentUsername)
  if (privilege !== null && privilege >= rolePrivilege) {
    const role = {
      name: roleName,
      privilege: rolePrivilege
    }
    return await createNewRole(role)
  }
  return null
}

export async function addRoleToUserAction(user_id: string, roleName: string) {
  const currentUser = await returnHighestRoleWithPrivilege(user_id)
  const currentUserPrivilege = currentUser.privilege
  const requestedRole = await getRoleByName(roleName)

  if (!currentUserPrivilege) throw new Error("Current user's privilege is null")
  if (!requestedRole?.privilege)
    throw new Error("Either requested role's privilege or the requested role itself does not exist")

  const requestedRolePrivilege = requestedRole.privilege

  if (currentUserPrivilege < requestedRolePrivilege)
    throw new Error("Current user's privilege is lower than the requested privilege")

  const { id: role_id } = requestedRole
  return addRoleToUser({ user_id, role_id })
}

export async function deleteRoleFromUserAction(user_id: string, roleName: string) {
  const currentUser = await returnHighestRoleWithPrivilege(user_id)
  const currentUserPrivilege = currentUser.privilege
  const requestedRole = await getRoleByName(roleName)

  if (!currentUserPrivilege) throw new Error("Current user's privilege is null")
  if (!requestedRole?.privilege)
    throw new Error("Either requested role's privilege or the requested role itself does not exist")

  const requestedRolePrivilege = requestedRole.privilege

  if (currentUserPrivilege < requestedRolePrivilege)
    throw new Error("Current user's privilege is lower than the requested privilege")

  const { id: role_id } = requestedRole
  return deleteRoleFromUser({ user_id, role_id })
}

export async function getThread(name: string) {
  const result = await getDiscussionThread(name)

  if (result.length === 0) {
    notFound()
  } else return result
}
