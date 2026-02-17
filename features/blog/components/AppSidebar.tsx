"use client"

import * as React from "react"
import { Sidebar, SidebarRail } from "@/components/ui/sidebar"
import { SidebarHeader } from "./AppSidebar/Header"
import { SidebarContent } from "./AppSidebar/Content"
import { SidebarUser } from "./AppSidebar/User"

import { authClient } from "@/lib/auth-client"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession()
  const user = session?.user
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
