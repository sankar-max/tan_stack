import type { Metadata } from "next"
import { AuthCard, SignUpForm } from "@/features/auth"

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a free Blog account. Start writing and sharing your stories with the world.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sign-up" },
}

export default function SignUpPage() {
  return (
    <AuthCard
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <SignUpForm />
    </AuthCard>
  )
}
