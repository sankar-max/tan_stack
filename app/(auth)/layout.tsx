import React from "react"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-background">
   
      
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
