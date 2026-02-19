"use client"

import { useSession } from "@/lib/auth-client"
import { useGetUser } from "./hooks/useGetUser"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfile } from "@/features/dashboard/user/components/UserProfile"
import { UserEditForm } from "@/features/dashboard/user/components/UserEditForm"
import { UserSecurity } from "@/features/dashboard/user/components/UserSecurity"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function Page() {
  const currentSession = useSession()
  const {
    data: user,
    isLoading,
    error,
  } = useGetUser({
    userId: currentSession.data?.user?.id || "",
  })

  if (isLoading) {
    return <UserDashboardSkeleton />
  }

  if (error || !user) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Card className="w-full max-w-md bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error?.message || "User not found"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-4">
          <UserProfile user={user} />
        </TabsContent>
        <TabsContent value="edit" className="space-y-4">
          <UserEditForm user={user} />
        </TabsContent>
        <TabsContent value="security" className="space-y-4">
          <UserSecurity />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function UserDashboardSkeleton() {
  return (
    <div className="container max-w-4xl py-6 space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="space-y-4">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  )
}

export default Page
