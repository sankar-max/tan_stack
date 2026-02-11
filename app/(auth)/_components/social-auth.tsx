"use client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { OAuthProviderT } from "../_lib"
import { signIn } from "@/lib/auth-client"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export const SocialAuth = ({ option }: { option: OAuthProviderT }) => {
  const { Icon, provider, label } = option
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignIn() {
    setIsLoading(true)
    try {
      const { error } = await signIn.social({
        provider,
        callbackURL: "/dashboard",
      })
      if (error) {
        toast.error(error.message || "Failed to sign in. Please try again.")
      } else {
        toast.success(`Signing in with ${label}...`)
      }
    } catch (error) {
      console.error("Error signing in:", error)
      toast.error("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full flex items-center gap-2 hover:bg-accent/50 transition-colors"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Icon className="h-4 w-4" />
      )}
      Continue with {label}
    </Button>
  )
}
