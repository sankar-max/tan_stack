import { AuthCard, SignUpForm } from "../_components"

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
