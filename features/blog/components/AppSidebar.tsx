"use client"

import * as React from "react"
import { Sidebar, SidebarRail } from "@/components/ui/sidebar"
import { SidebarHeader } from "./AppSidebar/Header"
import { SidebarContent } from "./AppSidebar/Content"
import { SidebarUser, type User } from "./AppSidebar/User"

import { authClient } from "@/lib/auth-client"

export function AppSidebar({
  user: initialUser,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user?: User | null }) {
  const { data: session } = authClient.useSession()
  const user = session?.user || initialUser
  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50"
      {...props}
    >
      <SidebarHeader />
      <SidebarContent />
      <SidebarUser user={user} />
      <SidebarRail />
    </Sidebar>
  )
}
