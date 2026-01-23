"use client"
import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth-client"
import { redirect } from "next/navigation"
// import { ThemeToggle } from "@/components/theme/theme-toggle"
import { ThemeDropdown } from "@/components/theme/theme-dropdown"
import { Loader2, LogOutIcon } from "lucide-react"
import { useUserProfile } from "@/hooks/use-user-profile"
import UserAvatar from "@/components/profile/avatar"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const { user, isPending } = useUserProfile()

  if (isPending)
    return (
      <div className="grid place-items-center h-screen">
        <Loader2 className="animate-spin" size={29} />
      </div>
    )
  if (!user) redirect("/sign-in")

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
        },
      },
    })
  }
  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Welcome, <UserAvatar /> {user?.name}!
        </h1>
        <div className="flex items-center gap-2">
          {/* <ThemeToggle /> */}
          <ThemeDropdown />
          <Button variant="outline" onClick={logout}>
            <LogOutIcon />
            Sign Out
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground">
        This is your dashboard. You can toggle the theme using the switchers
        above.
      </p>
    </div>
  )
}
