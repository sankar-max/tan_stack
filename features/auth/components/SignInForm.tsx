"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/auth-client"
import { signInSchema, SignInSchemaT } from "../utils"
import { SocialAuth } from "./SocialAuth"
import { OAuthProviders } from "../utils"

import { authConfig as centralConfig } from "@/lib/config"

export function SignInForm() {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<SignInSchemaT>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: SignInSchemaT) {
    setIsLoading(true)
    try {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
        callbackURL: centralConfig.callbackUrl,
      })

      if (error) {
        toast.error(
          error.message || "Failed to sign in. Please check your credentials.",
        )
        return
      }

      toast.success("Signed in successfully!")
    } catch {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="name@example.com"
                    className="bg-background/50 backdrop-blur-sm focus-visible:ring-primary/20 transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-background/50 backdrop-blur-sm focus-visible:ring-primary/20 transition-all duration-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full h-11 transition-all duration-200 active:scale-[0.98]"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-muted" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-medium tracking-wider">
            Or continue with
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {OAuthProviders.map((provider) => (
          <SocialAuth key={provider.provider} option={provider} />
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground/80">
        Don&apos;t have an account?{" "}
        <Link
          href={centralConfig.signUpUrl}
          className="text-primary hover:underline font-semibold"
        >
          Sign Up
        </Link>
      </p>
    </div>
  )
}
