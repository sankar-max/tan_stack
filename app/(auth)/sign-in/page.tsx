import type { Metadata } from "next"
import { AuthCard } from "@/features/auth"
import dynamic from "next/dynamic"

const SignInForm = dynamic(() => import("@/features/auth").then(mod => mod.SignInForm))

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Blog account to manage your stories and reading list.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/sign-in" },
}

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <SignInForm />
    </AuthCard>
  )
}
