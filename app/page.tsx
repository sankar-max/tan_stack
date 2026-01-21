"use client"

import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()
  const session = useSession()

  useEffect(() => {
    function redirectTo() {
      if (!session) {
        router.push("/sign-in")
      } else {
        router.push("/dashboard")
      }
    }
    redirectTo()
  }, [router])
  return null
}
