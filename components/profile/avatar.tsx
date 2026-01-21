import React from "react"
import { useUserProfile } from "@/hooks/use-user-profile"
import Image from "next/image"

function UserAvatar() {
  const { user } = useUserProfile()
  if (!user || !user.img || !user.name) return null
  return (
    <div className="relative w-10 h-10">
      <Image src={user.img} alt={user.name} fill className="rounded-full" />
    </div>
  )
}

export default UserAvatar
