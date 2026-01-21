import { AuthCard, SignInForm } from "../_components"

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
