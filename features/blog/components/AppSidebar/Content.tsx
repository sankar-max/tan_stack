"use client"

import React from "react"
import Link from "next/link"
import { BookOpen, Sparkles } from "lucide-react"
import {
  SidebarContent as BaseSidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function SidebarContent() {
  return (
    <BaseSidebarContent className="px-2 py-4">
      <SidebarMenu className="gap-2">
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Feed"
            className="h-10 px-3 hover:bg-accent/50 transition-colors"
          >
            <Link
              href="/blog"
              className="flex items-center gap-3 font-medium"
            >
              <BookOpen className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span>Feed</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            tooltip="Pro Features"
            className="h-10 px-3 hover:bg-accent/50 transition-colors"
          >
            <Link href="#" className="flex items-center gap-3 font-medium">
              <Sparkles className="size-4 text-amber-500" />
              <span>Pro Features</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </BaseSidebarContent>
  )
}
