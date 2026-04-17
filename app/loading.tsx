import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary/50" />
      <p className="text-sm font-medium text-muted-foreground animate-pulse">
        Loading your experience...
      </p>
    </div>
  )
}
