"use client";

import { useUserProfile } from "@/features/user";
import LoadingDashboard from "./LoadingDashboard";
import { DashboardHero } from "./DashboardHero";
import { DashboardStats } from "./DashboardStats";
import { DashboardActivity } from "./DashboardActivity";
import { DashboardInsights } from "./DashboardInsights";

interface DashboardViewProps {
  user?: any;
}

export default function DashboardView({ user: initialUser }: DashboardViewProps) {
  const { user: hookUser, isPending } = useUserProfile();
  const user = initialUser || hookUser;

  if (isPending && !initialUser) return <LoadingDashboard />;
  if (!user) return null;

  return (
    <div className="space-y-10 pb-10">
      <DashboardHero user={user} />
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardActivity />
        <DashboardInsights />
      </div>
    </div>
  );
}
