export type TipTapInputProps = {
  text: string
}

export type EditorContextType = {
  // invite: strings
  text: string
  // setText : Dispatch<SetStateAction<boolean>>
  // eslint-disable-next-line no-unused-vars
  handleTextChange: (text: string) => void
  clearText: () => void
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
  mostRecentThread?: {
    id: string
    name: string
    repliedOrCreatedBy: string
  }
  threadsCount?: number
  repliesCount?: number
}

export type SectionWithTopics = {
  id: string
  name: string
  topics: Topic[]
}
