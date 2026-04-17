import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DashboardView } from "@/features/dashboard";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <DashboardView user={session?.user as any} />;
}
