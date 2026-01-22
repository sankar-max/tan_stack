"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Settings, ChevronsUpDown } from "lucide-react"
import { signOut } from "@/lib/auth-client"
import { useSidebar } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

type User = {
  id: string
  name: string
  email: string
  image?: string | null
}

interface SidebarUserProps {
  user?: User | null
}

export function SidebarUser({ user }: SidebarUserProps) {
  const router = useRouter()
  const { isMobile } = useSidebar()

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/")
        },
      },
    })
  }

  return (
    <SidebarFooter className="p-4 border-t border-border/50">
      <SidebarMenu>
        <SidebarMenuItem>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-xl transition-all hover:bg-accent/50"
                >
                  <Avatar className="h-9 w-9 rounded-lg border border-border/50">
                    <AvatarImage
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="rounded-lg bg-muted text-foreground font-semibold">
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {user.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground/50" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl border-border/50 shadow-xl bg-background/95 backdrop-blur-sm"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={user.image ?? undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/50" />
                <DropdownMenuItem className="gap-2 p-2">
                  <Settings className="size-4" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="gap-2 p-2"
                  onClick={handleSignOut}
                >
                  <LogOut className="size-4 text-destructive" />
                  <span className="text-destructive">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="p-2 text-sm text-center text-muted-foreground bg-muted/50 rounded-lg">
              <p className="mb-2">Guest User</p>
              <Link
                href="/sign-in"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  )
}
