import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { BookmarkList } from "@/features/blog/components/BookmarkList"
import { Bookmark } from "lucide-react"

export default async function BookmarksPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="flex-1 space-y-10 p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-2xl ring-1 ring-primary/20">
            <Bookmark className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-4xl font-black tracking-tight">Library</h1>
        </div>
        <p className="text-muted-foreground font-medium text-lg">
          Your curated collection of stories and inspirations.
        </p>
      </div>

      <BookmarkList userId={session.user.id} />
    </div>
  )
}
