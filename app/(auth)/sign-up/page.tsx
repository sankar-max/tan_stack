import type { Metadata } from "next"
import { AuthCard } from "@/features/auth"
import dynamic from "next/dynamic"

const SignUpForm = dynamic(() => import("@/features/auth").then(mod => mod.SignUpForm))

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
