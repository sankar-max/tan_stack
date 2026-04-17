"use client";

import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import Link from "next/link";
import { ThemeDropdown } from "@/components/theme/theme-dropdown";
import Image from "next/image";

interface DashboardHeroProps {
  user: any;
}

export function DashboardHero({ user }: DashboardHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 p-8 md:p-12 text-white shadow-2xl transition-all duration-500 hover:shadow-primary/10">
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
        <div className="space-y-6 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Active Session
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
            Welcome,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-violet-400">
              {user?.name || "Storyteller"}
            </span>
          </h1>
          <p className="text-lg text-zinc-400 font-medium leading-relaxed max-w-lg">
            Your creative impact is growing. This week, your stories reached{" "}
            <span className="text-white font-bold underline decoration-primary/30 underline-offset-4">
              1,284 readers
            </span>
            .
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href="/dashboard/posts/new">
              <Button
                size="lg"
                className="rounded-full px-8 h-14 text-base font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all duration-300"
              >
                <Plus className="mr-2 h-5 w-5" /> Write New Story
              </Button>
            </Link>
            <ThemeDropdown />
          </div>
        </div>
        <div className="hidden lg:block relative">
          <div className="absolute -inset-10 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
          <div className="relative h-56 w-56 flex items-center justify-center rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl overflow-hidden group">
            {user?.image ? (
              <Image
                fill
                className=" text-zinc-700 bg-center object-cover bg-cover transition-transform duration-700 group-hover:scale-110"
                src={user.image}
                alt="profile"
              />
            ) : (
              <User className="h-32 w-32 text-zinc-700 transition-transform duration-700 group-hover:scale-110" />
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </div>
      {/* Abstract background elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
