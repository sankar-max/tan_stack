"use client"

import * as React from "react"
import { Sidebar, SidebarRail } from "@/components/ui/sidebar"
import { SidebarHeader } from "./AppSidebar/Header"
import { SidebarContent } from "./AppSidebar/Content"
import { SidebarUser } from "./AppSidebar/User"

type User = {
  id: string
  name: string
  email: string
  image?: string | null
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: User | null
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
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
