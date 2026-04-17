"use client";

import { DashboardSidebar } from "@/features/dashboard";
import { GlobalModal } from "@/features/blog/components/modal/GlobalModal";
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

interface BlogLayoutViewProps {
  children: React.ReactNode;
  user: any;
}

export function BlogLayoutView({ children, user }: BlogLayoutViewProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <GlobalModal />
      <SidebarInset className="bg-background">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border/40 bg-background/80 px-6 backdrop-blur-md transition-all">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1 h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent/50" />
            <Separator
              orientation="vertical"
              className="mr-2 h-4 bg-border/50"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink
                    href="#"
                    className="text-muted-foreground hover:text-foreground transition-colors font-medium"
                  >
                    TanStack
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block opacity-50" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-bold text-foreground">
                    Blog
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

        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-8 p-6 lg:p-10 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
