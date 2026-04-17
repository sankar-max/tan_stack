"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

import {
  FileText,
  Home,
  Settings,
  User,
  Sparkles,
  LayoutDashboard,
  PenTool,
  Bookmark,
  User2,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";

export function DashboardSidebar({
  user,
}: {
  user?: { name?: string | null; image?: string | null; email?: string | null };
}) {
  const pathname = usePathname();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const mainItems = [
    {
      title: "Home",
      url: "/blog",
      icon: Home,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Stories",
      url: "/dashboard/posts",
      icon: FileText,
    },
    {
      title: "Bookmarks",
      url: "/dashboard/bookmarks",
      icon: Bookmark,
    },
  ];

  const secondaryItems = [
    {
      title: "Profile",
      url: "/dashboard/user",
      icon: User,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-border/50 bg-background/50 backdrop-blur-xl"
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Sparkles className="h-5 w-5" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight">
                Story Platform
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                Premium
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 py-4 gap-6">
        {/* Action Section */}
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard/posts/new">
              <SidebarMenuButton
                className={`
                  h-11 rounded-xl transition-all duration-300
                  ${
                    isCollapsed
                      ? "bg-primary text-primary-foreground"
                      : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-md hover:shadow-lg hover:shadow-primary/20"
                  }
                `}
              >
                <PenTool className={isCollapsed ? "h-5 w-5" : "h-4 w-4 mr-2"} />
                {!isCollapsed && (
                  <span className="font-semibold">Write Story</span>
                )}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Main Navigation */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">
              Navigation
            </p>
          )}
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    pathname === item.url || pathname.startsWith(item.url + "/")
                  }
                  className="h-10 rounded-xl px-4 hover:bg-accent/50 group"
                >
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">{item.title}</span>
                    {!isCollapsed && pathname === item.url && (
                      <div className="ml-auto w-1 h-1 rounded-full bg-primary" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* Preferences */}
        <div className="space-y-1">
          {!isCollapsed && (
            <p className="px-4 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mb-2">
              Account
            </p>
          )}
          <SidebarMenu>
            {secondaryItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  className="h-10 rounded-xl px-4 hover:bg-accent/50 group"
                >
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    <span className="font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-border/50 gap-4">
        {user && (
          <div
            className={`flex items-center gap-3 p-2 rounded-xl bg-muted/30 ${isCollapsed ? "justify-center" : ""}`}
          >
            <Avatar className="h-8 w-8 rounded-lg border border-border/50">
              <AvatarImage src={user.image ?? undefined} alt={user.name || "User"} />
              <AvatarFallback className="rounded-lg bg-muted text-foreground font-semibold text-[10px]">
                {user.name?.slice(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold truncate leading-none mb-1">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            )}
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              className="h-10 rounded-xl px-4 hover:bg-destructive/10 hover:text-destructive group transition-all"
              onClick={async () => {
                const { authClient } = await import("@/lib/auth-client");
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/sign-in";
                    },
                  },
                });
              }}
            >
              <LogOut className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
              {!isCollapsed && <span className="font-bold">Logout</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
