"use server"

import { logger } from "@projectforum/lib/logger"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import {
  returnHighestRoleWithPrivilege,
  getUserById,
  getSectionIdByTopicId,
  createDiscussionThread,
  createNewRole,
  addRoleToUser,
  getRoleByName,
  deleteRoleFromUser,
  createSection
} from "@projectforum/db/queries"
import { Prisma } from "@prisma/client"

export async function createNewSection(formdata: FormData) {
  const data: Prisma.SectionCreateInput = {
    name: formdata.get("name") as string
  }
  await createSection(data)
}

export async function createNewThread(text: string, topicId: string, formdata: FormData) {
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
  const sectionId = await getSectionIdByTopicId(topicId)
  const user = await currentUser()
  logger.debug(text)
  const name = formdata.get("title")

  if (!name && name?.length == 0) {
    logger.error("Title is empty")
    return
  }
  if (sectionId && user) {
    const data: Prisma.ThreadUncheckedCreateInput = {
      name: name as string,
      content: text,
      section_id: sectionId.section_id,
      topic_id: topicId,
      user_id: user.id
    }
    await createDiscussionThread(data)
    redirect(`/home/${topicId}`)
  }
}

export async function getUserRole() {
  const userId = auth().userId
  if (!userId) return null

  logger.debug(userId)
  const userData = await getUserById(userId)
  logger.info(userData, "getUserRole() :: Current User")
  if (userData) {
    const userPrivilegeData = await returnHighestRoleWithPrivilege(userData.id)
    logger.debug(userPrivilegeData, "getUserRole():: userPrivilegeData")
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
