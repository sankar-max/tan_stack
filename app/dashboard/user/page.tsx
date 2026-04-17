import { Metadata } from "next";
import { ProfileView } from "@/features/user/components/ProfileView";

export const metadata: Metadata = {
  title: "Profile",
  description: "View and manage your profile settings.",
};

export default function ProfilePage() {
  return <ProfileView />;
}
