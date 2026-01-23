"use client"

import React from "react"
import Link from "next/link"
import { Command } from "lucide-react"
import {
  SidebarHeader as BaseSidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function SidebarHeader() {
  return (
    <BaseSidebarHeader className="h-16 border-b border-border/50 flex items-center justify-center px-4">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            asChild
            className="hover:bg-accent/50 transition-colors"
          >
            <Link href="/blog">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Command className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold tracking-tight">
                  TanStack
                </span>
                <span className="truncate text-xs font-medium text-muted-foreground">
                  Blog Platform
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </BaseSidebarHeader>
  )
}
