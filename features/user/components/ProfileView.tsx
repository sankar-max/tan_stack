"use client";

import { useUserProfile } from "@/features/user/hooks/useUserProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Shield, LogOut, Camera } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function ProfileView() {
  const { user, isPending } = useUserProfile();
  const router = useRouter();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isPending) return <div className="p-8 text-center animate-pulse">Loading profile...</div>;
  if (!user) return <div className="p-8 text-center text-destructive font-bold">Please sign in to view your profile.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 ring-4 ring-primary/10 shadow-2xl">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="bg-primary/5 text-primary text-2xl font-black">
                {user.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-lg border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={16} />
            </Button>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">{user.name}</h1>
            <p className="text-muted-foreground font-medium flex items-center gap-2">
              <Mail size={16} className="text-primary/60" />
              {user.email}
            </p>
          </div>
        </div>
        <Button variant="destructive" className="rounded-full px-6 font-bold" onClick={handleSignOut}>
          <LogOut size={16} className="mr-2" /> Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-none shadow-xl shadow-black/5 bg-background/50 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                <User size={20} className="text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription className="font-medium">Update your public profile details.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                  <Input id="name" defaultValue={user.name ?? ""} className="rounded-xl h-12 bg-muted/20 border-none focus-visible:ring-2 focus-visible:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</Label>
                  <Input id="email" defaultValue={user.email ?? ""} disabled className="rounded-xl h-12 bg-muted/10 border-none" />
                </div>
              </div>
              <Button className="rounded-full px-8 font-black">Save Changes</Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl shadow-black/5 bg-background/50 backdrop-blur-xl rounded-[2rem]">
            <CardHeader className="p-8 pb-4">
              <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2">
                <Shield size={20} className="text-primary" />
                Account Security
              </CardTitle>
              <CardDescription className="font-medium">Manage your password and security settings.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-6">
              <div className="p-6 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="font-bold text-amber-600">Password not set?</p>
                  <p className="text-xs text-amber-600/70 font-medium">Add a password to enable traditional login alongside social providers.</p>
                </div>
                <Button variant="secondary" size="sm" className="rounded-full font-bold">Add Password</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-none shadow-xl shadow-black/5 bg-primary p-8 text-primary-foreground rounded-[2rem] overflow-hidden relative group">
            <div className="relative z-10 space-y-4">
              <h3 className="text-2xl font-black leading-tight">Pro Plan</h3>
              <p className="text-primary-foreground/80 font-medium">Unlock unlimited stories and advanced analytics.</p>
              <Button className="w-full rounded-full bg-white text-primary hover:bg-white/90 font-black shadow-xl shadow-black/10">Upgrade Now</Button>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          </Card>
        </div>
      </div>
    </div>
  );
}
