"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOutIcon } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function DashboardInsights() {
  const router = useRouter();

  const logout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  return (
    <Card className="border-none bg-gradient-to-br from-violet-600/5 to-indigo-600/5 backdrop-blur-md shadow-sm border border-violet-500/10 overflow-hidden relative">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="text-violet-500 h-5 w-5" />
          Creator Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Based on your recent posts, your audience engages most with{" "}
          <span className="font-bold text-violet-600 dark:text-violet-400">
            Technology
          </span>{" "}
          and{" "}
          <span className="font-bold text-violet-600 dark:text-violet-400">
            Personal Growth
          </span>{" "}
          topics.
        </p>
        <Button
          variant="outline"
          className="w-full rounded-xl border-violet-500/20 hover:bg-violet-500/5 hover:text-violet-600 transition-all duration-300"
        >
          View Detailed Analytics
        </Button>
        <div className="pt-4 flex justify-end">
          <Button
            variant="ghost"
            className="text-xs font-bold text-muted-foreground hover:text-destructive"
            onClick={logout}
          >
            <LogOutIcon className="mr-2 h-3 w-3" /> Sign Out
          </Button>
        </div>
      </CardContent>
      <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-violet-500/10 rounded-full blur-2xl" />
    </Card>
  );
}
