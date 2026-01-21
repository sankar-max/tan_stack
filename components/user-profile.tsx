"use client"
import { useSession } from "@/lib/auth-client"

export function UserProfile() {
  const { data: session, isPending } = useSession()

  const data = {
    isPending,
    user: {
      img: session?.user.image,
      name: session?.user.name,
      email: session?.user.email,
      id: session?.user.id,
    },
  }
  return data
}
