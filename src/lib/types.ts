import {
  cronJobLogs,
  discussionThreads,
  replies,
  roles,
  sections,
  topics,
  users
} from "@projectforum/server/db/schema"

export type InsertSection = typeof sections.$inferInsert
export type SelectSection = typeof sections.$inferSelect

export type InsertTopic = typeof topics.$inferInsert
export type SelectTopic = typeof topics.$inferSelect

export type InsertDiscussionThreads = typeof discussionThreads.$inferInsert
export type SelectDiscussionThreads = typeof discussionThreads.$inferSelect

export type InsertCronJobLogs = typeof cronJobLogs.$inferInsert
export type SelectCronJobLogs = typeof cronJobLogs.$inferSelect

export type InsertUser = typeof users.$inferInsert
export type SelectUser = typeof users.$inferSelect

export type InsertReplies = typeof replies.$inferInsert
export type SelectReplies = typeof replies.$inferSelect

export type InsertRole = typeof roles.$inferInsert
export type SelectRole = typeof roles.$inferSelect

export type TipTapInputProps = {
  text: string
}

export type EditorContextType = {
  // invite: strings
  text: string
  // setText : Dispatch<SetStateAction<boolean>>
  // eslint-disable-next-line no-unused-vars
  handleTextChange: (text: string) => void
}

export type InviteContextType = {
  // invite: strings
  isValidInvite: boolean
  role: string | null
  inviteId: string | null
  // eslint-disable-next-line no-unused-vars
  validateInvite: (invite: string) => Promise<boolean>
}

export type Topic = {
  id: string
  name: string
}

export type SectionWithTopics = {
  id: string
  name: string
  topics: Topic[]
}
