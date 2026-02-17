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

import { authClient } from "@/lib/auth-client"

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {}

export function AppSidebar({ ...props }: AppSidebarProps) {
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
