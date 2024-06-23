"use client"
import { FC, ReactNode, createContext, useState } from "react"

export type InviteContextType = {
  // invite: strings
  validInvites: string[]
  isValidInvite: boolean
  // eslint-disable-next-line no-unused-vars
  validateInvite: (invite: string) => boolean
}

export const InviteContext = createContext<InviteContextType | null>(null)

export const InviteProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isValidInvite, setIsValidInvite] = useState(false)
  const validInvites = ["HELLO", "BOMBOCLATT", "FORUM"]

  const validateInvite = (invite: string) => {
    const computed = validInvites.includes(invite.toUpperCase())
    setIsValidInvite(computed)
    return computed
  }

  return (
    <InviteContext.Provider value={{ isValidInvite, validInvites, validateInvite }}>
      {children}
    </InviteContext.Provider>
  )
}
