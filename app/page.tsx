import { redirect } from "next/navigation"
import { authConfig } from "@/lib/config"

export default function Home() {
  redirect(authConfig.callbackUrl)
}
