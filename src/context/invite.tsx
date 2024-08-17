"use client"
import { validateInviteCode } from "@projectforum/app/dashboard/helper"
import { InviteContextType } from "@projectforum/lib/types"
import { FC, ReactNode, createContext, useState } from "react"

export const InviteContext = createContext<InviteContextType | null>(null)

export const InviteProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isValidInvite, setIsValidInvite] = useState(false)
  const [role, setRole] = useState<string | null>(null)
  const [inviteId, setInviteId] = useState<string | null>(null)

  const validateInvite = async (invite: string) => {
    const computed = await validateInviteCode(invite)
    setIsValidInvite(computed.isValidInvite)
    setRole(computed.role)
    setInviteId(computed.inviteId)
    return computed.isValidInvite
  }

  return (
    <InviteContext.Provider value={{ isValidInvite, role, validateInvite, inviteId }}>
      {children}
    </InviteContext.Provider>
  )
}
