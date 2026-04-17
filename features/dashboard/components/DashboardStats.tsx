"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, TrendingUp, Users } from "lucide-react";

export function DashboardStats() {
  const stats = [
    {
      title: "Total Stories",
      value: "12",
      icon: BookOpen,
      color: "text-primary",
      bg: "bg-primary/5",
    },
    {
      title: "Total Views",
      value: "1,284",
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Followers",
      value: "48",
      icon: Users,
      color: "text-violet-500",
      bg: "bg-violet-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <Card
          key={stat.title}
          className="relative overflow-hidden border-none bg-background shadow-lg hover:shadow-xl transition-all duration-500 group"
        >
          <div className={`absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity`}>
            <stat.icon size={80} />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em]">
              {stat.title}
            </CardTitle>
            <div
              className={`p-2.5 rounded-2xl ${stat.bg} ${stat.color} shadow-inner group-hover:scale-110 transition-transform duration-500`}
            >
              <stat.icon size={22} />
            </div>
          </CardHeader>
          <CardContent className="relative z-10 pt-4">
            <div className="text-4xl font-black tabular-nums tracking-tight">
              {stat.value}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                <TrendingUp size={10} className="mr-1" /> +12%
              </span>
              <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider">
                Growth this month
              </span>
            </div>
          </CardContent>
          <div className="absolute bottom-0 left-0 h-1.5 w-full bg-muted/20" />
          <div className={`absolute bottom-0 left-0 h-1.5 w-0 bg-primary transition-all duration-700 group-hover:w-full`} />
        </Card>
      ))}
    </div>
  );
}
