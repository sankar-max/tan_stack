"use client"
import { useSession } from "@/lib/auth-client"

export function useUserProfile() {
  const { data: session, isPending } = useSession()

  const user = session?.user ? {
    img: session.user.image,
    name: session.user.name,
    email: session.user.email,
    id: session.user.id,
  } : null

  return {
    isPending,
    user,
  }
}
