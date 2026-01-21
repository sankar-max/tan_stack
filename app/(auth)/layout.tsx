import React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/40 p-4 md:p-8">
      <div className="w-full max-w-md space-y-8">
        {children}
      </div>
    </div>
  )
}
