import { AuthCard, SignUpForm } from "@/features/auth"

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
