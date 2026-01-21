"use client"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { OAuthProviderT } from "./provider-data"
import { signIn } from "@/lib/auth-client"

export const OAuthSignIn = ({ option }: { option: OAuthProviderT }) => {
  const { Icon, provider, label } = option
  async function handleSignIn() {
    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
      })
      toast.success("Signed in successfully!")
    } catch (error) {
      console.error("Error signing in:", error)
      toast.error("Failed to sign in. Please try again.")
    }
  }
  return (
    <Button variant="outline" onClick={handleSignIn}>
      <Icon />
      {label}
    </Button>
  )
}
