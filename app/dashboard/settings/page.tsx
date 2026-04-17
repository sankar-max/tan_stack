import { Metadata } from "next";
import { ProfileView } from "@/features/user/components/ProfileView";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your account settings and preferences.",
};

export default function SettingsPage() {
  return <ProfileView />;
}
