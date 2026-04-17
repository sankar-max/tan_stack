"use client";

import { DashboardSidebar } from "@/features/dashboard";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bell } from "lucide-react";
import { ThemeDropdown } from "@/components/theme/theme-dropdown";
import { GlobalModal } from "@/features/blog/components/modal/GlobalModal";

interface DashboardLayoutViewProps {
  children: React.ReactNode;
  user: any;
}

export function DashboardLayoutView({ children, user }: DashboardLayoutViewProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar user={user} />
        <GlobalModal />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          {/* Header */}
          <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:px-6 transition-all">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="h-9 w-9 rounded-lg hover:bg-accent transition-colors" />
              <Separator orientation="vertical" className="h-6 w-px" />
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href="/dashboard"
                      className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                    >
                      Dashboard
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-bold text-foreground">
                      Overview
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="flex items-center gap-3">
              <ThemeDropdown />

              <button className="relative h-9 w-9 flex items-center justify-center rounded-full hover:bg-accent text-muted-foreground transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border-2 border-background" />
              </button>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-muted/20">
            <div className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
