import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const useInvite = () => {
  const [localInvite, setLocalInvite] = useState<string | null>(null)
  const router = useRouter()

  const saveInvite = (invite: string) => {
    localStorage.setItem("invite", invite)
  }
  const retriveInvite = () => localStorage.getItem("invite")

  useEffect(() => {
    setLocalInvite(retriveInvite())
  }, [])

  useEffect(() => {
    if (localInvite != null) router.replace("/invite")
  }, [localInvite, router])

  return { retriveInvite, saveInvite }
}
