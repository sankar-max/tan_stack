"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RotateCcw } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <AlertCircle className="h-12 w-12 text-destructive" />
      </div>
      <h2 className="text-3xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        We encountered an unexpected error. Our team has been notified and we're working on a fix.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          Go to Home
        </Button>
      </div>
    </div>
  )
}
