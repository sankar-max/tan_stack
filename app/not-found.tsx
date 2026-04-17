import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileQuestion, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 text-center">
      <div className="bg-muted p-6 rounded-full mb-6">
        <FileQuestion className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-3xl font-bold mb-2">404 - Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button className="gap-2">
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  )
}
