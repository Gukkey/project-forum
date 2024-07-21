"use server"

import {
  addRole,
  addRoleToUserInDatabase,
  createSection,
  deleteRoleFromUserDatabase,
  getRolePrivilege,
  getUserById,
  returnHighestRoleWithPrivilege
} from "@projectforum/server/db/queries"
import { createDiscussionThread } from "@projectforum/server/db/queries"
import { getSectionId } from "@projectforum/server/db/queries"
import { logger } from "@projectforum/lib/logger"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { InsertDiscussionThreads, InsertSection } from "@projectforum/lib/types"

export async function createNewSection(formdata: FormData) {
  const data: InsertSection = {
    name: formdata.get("name") as string,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  await createSection(data)
}

export async function createNewThread(text: string, formdata: FormData) {
  const content = formdata.get("content") as string

  // Check if content is empty
  if (!content.trim()) {
    logger.error(" Content is empty ")
    return // Exit the function early
  }

  if (content === "<p></p>") {
    logger.error(" Content is empty ")
    return // Exit the function early
  }

  const topicId = formdata.get("topicId") as string
  const sectionId = await getSectionId(topicId)

  logger.debug(text)

  const data: InsertDiscussionThreads = {
    title: formdata.get("title") as string,
    content: text,
    sectionId: sectionId[0].sectionId,
    topicId: topicId,
    userId: formdata.get("userId") as string
  }
  await createDiscussionThread(data)
  redirect(`/home/${topicId}`)
}

export async function getUserRole() {
  const userId = auth().userId
  if (!userId) return null

  logger.debug(userId)
  const userData = await getUserById(userId)
  logger.debug(`userData: ${userData[0].username}`)
  let defaultData = {
    name: "member",
    privilege: 10
  }
  try {
    const highestRole = await returnHighestRoleWithPrivilege(userData[0]?.username)
    defaultData = {
      name: highestRole.rows[0].name as string,
      privilege: highestRole.rows[0].privilege as number
    }
    logger.debug(`highestRole: ${highestRole}`)
    return defaultData
  } catch (error) {
    logger.error(`Error while trying to get highest role: ${error}`)
    return defaultData
  }
}

export async function addRoleWithPrivilege(
  roleName: string,
  rolePrivilege: number,
  currentUsername: string
) {
  const roleWithPrivilege = await returnHighestRoleWithPrivilege(currentUsername)
  const privilege = roleWithPrivilege.rows[0].privilege as number
  if (privilege !== null && privilege >= rolePrivilege) {
    const role = {
      name: roleName,
      privilege: rolePrivilege
    }
    return await addRole(role)
  }
  return Promise.reject(`Requested Role privilege is higher than current user's highest privilege`)
}

export async function addRoleToUser(username: string, roleName: string, currentUsername: string) {
  const currentUser = await returnHighestRoleWithPrivilege(currentUsername)
  const currentUserPrivilege = currentUser.rows[0].privilege as number
  const requestedRole = await getRolePrivilege(roleName)
  const requestedRolePrivilege = requestedRole[0].privilege

  if (currentUserPrivilege !== null && requestedRolePrivilege !== null) {
    if (currentUserPrivilege > requestedRolePrivilege) {
      const user = {
        username: username,
        role: roleName
      }
      return addRoleToUserInDatabase(user)
    }
    return Promise.reject(`Current user's privilege is lower than requested role privilege`)
  }
  return Promise.reject(`Either current user's privilege or requested role's privilege is null`)
}

export async function deleteRoleFromUser(
  username: string,
  roleName: string,
  currentUsername: string
) {
  const currentUser = await returnHighestRoleWithPrivilege(currentUsername)
  const currentUserPrivilege = currentUser.rows[0].privilege as number
  const requestedRole = await getRolePrivilege(roleName)
  const requestedRolePrivilege = requestedRole[0].privilege

  if (currentUserPrivilege !== null && requestedRolePrivilege !== null) {
    if (currentUserPrivilege > requestedRolePrivilege) {
      const user = {
        username: username,
        role: roleName
      }
      return deleteRoleFromUserDatabase(user)
    }
    return Promise.reject(`Current user's privilege is lower than requested role privilege`)
  }
  return Promise.reject(`Either current user's privilege or requested role's privilege is null`)
}
