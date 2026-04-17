"use client"

import { useActionState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import TipTapEditor, { TipTapEditorRef } from "./PostEditor"
import type { PostState } from "../actions"
import { useRef, useState } from "react"
import { 
  Loader2, 
  Sparkles, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Save, 
  Send,
  ChevronLeft,
  Settings2,
  AlertCircle
} from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import Link from "next/link"
import { Card } from "@/components/ui/card"

interface PostFormProps {
  initialData?: {
    id?: string
    title: string
    content: string
    published: boolean
    excerpt?: string | null
  }
  action: (_prevState: PostState, _formData: FormData) => Promise<PostState>
  submitLabel?: string
}

export function PostForm({
  initialData,
  action,
  submitLabel = "Save",
}: PostFormProps) {
  const initialState: PostState = { message: null, errors: {} }
  const [state, formAction, isPending] = useActionState(action, initialState)
  const editorRef = useRef<TipTapEditorRef>(null)
  const [published, setPublished] = useState(initialData?.published || false)
  const [title, setTitle] = useState(initialData?.title || "")
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "")

  // Watch for errors and show toasts
  useEffect(() => {
    if (state.message && state.errors && Object.keys(state.errors).length > 0) {
      toast.error(state.message, {
        description: "Please check the highlighted fields and try again.",
      })
    } else if (state.message && !state.errors) {
      // This might be a generic error from database
      toast.error(state.message)
    }
  }, [state])

  const handleSubmit = (formData: FormData) => {
    const html = editorRef.current?.getHTML()
    if (html) {
      formData.append("content", html)
    }
    formData.set("published", published.toString())
    formAction(formData)
  }

  const isEditing = !!initialData

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ── Sticky Navigation Bar ── */}
      <div className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 overflow-hidden">
            <Link href="/dashboard/posts">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-accent h-9 w-9 flex-shrink-0">
                <ChevronLeft size={18} />
              </Button>
            </Link>
            <div className="h-4 w-px bg-border/50 hidden sm:block" />
            <div className="flex items-center gap-2 text-sm font-medium truncate">
              <span className="text-muted-foreground hidden md:inline">Stories</span>
              <span className="text-muted-foreground/30 hidden md:inline">/</span>
              <span className="truncate max-w-[120px] sm:max-w-[200px]">
                {isEditing ? `Edit: ${title || "Untitled"}` : "Create New Story"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Status Toggle (Desktop) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                {published ? "Public" : "Draft"}
              </span>
              <Switch
                checked={published}
                onCheckedChange={setPublished}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>

            {/* Submit Button */}
            <form action={handleSubmit}>
              <Button
                type="submit"
                disabled={isPending}
                className={`
                  h-10 px-6 rounded-full font-bold shadow-lg transition-all duration-300 active:scale-95
                  ${published
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                    : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20"
                  }
                `}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    {published ? <Send className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
                    {published ? (isEditing ? "Update" : "Publish") : (isEditing ? "Save" : "Create")}
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main Editor Body ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
        {/* Mobile Status Bar */}
        <div className="flex sm:hidden items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
           <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
              <span className="text-xs font-bold uppercase tracking-wider">{published ? "Public Mode" : "Draft Mode"}</span>
           </div>
           <Switch
                checked={published}
                onCheckedChange={setPublished}
                className="data-[state=checked]:bg-emerald-500"
            />
        </div>

        {/* Form Inputs */}
        <div className="space-y-10">
          {/* Title Area */}
          <div className="space-y-4">
            <Input
              name="title"
              placeholder="Enter a title that hooks your readers..."
              className="
                w-full text-3xl sm:text-5xl font-black tracking-tight leading-tight
                border-none shadow-none bg-transparent px-0 py-0 h-auto
                focus-visible:ring-0 focus-visible:outline-none
                placeholder:text-muted-foreground/20
                text-foreground
              "
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            {state.errors?.title && (
              <div className="flex items-center gap-2 text-destructive text-xs font-bold bg-destructive/5 px-3 py-1.5 rounded-lg w-fit">
                <AlertCircle size={14} />
                {state.errors.title[0]}
              </div>
            )}
          </div>

          {/* Metadata Area */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8 items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em]">
                <Sparkles size={12} className="text-primary" />
                Story Excerpt
              </div>
              <Textarea
                name="excerpt"
                placeholder="A brief summary for social media and search engines..."
                className="
                  w-full resize-none border-none shadow-none bg-muted/20 px-4 py-3
                  text-base text-muted-foreground leading-relaxed rounded-2xl
                  focus-visible:ring-1 focus-visible:ring-primary/20
                  placeholder:text-muted-foreground/30
                  min-h-[100px]
                "
                maxLength={300}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
              />
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-muted-foreground/40 font-medium italic">
                   Shown in post previews and SEO metadata.
                </span>
                <span className={`text-[10px] font-bold tabular-nums ${excerpt.length > 250 ? "text-amber-500" : "text-muted-foreground/40"}`}>
                  {excerpt.length}/300
                </span>
              </div>
            </div>

            <div className="hidden md:block space-y-4 pt-7">
              <Card className="border-border/50 bg-background/50 shadow-sm overflow-hidden rounded-2xl">
                 <div className="p-3 bg-muted/30 border-b border-border/50">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Visibility</span>
                 </div>
                 <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between gap-2">
                       <div className="flex items-center gap-2">
                          {published ? <Eye size={14} className="text-emerald-500" /> : <EyeOff size={14} className="text-muted-foreground" />}
                          <span className="text-xs font-medium">{published ? "Public" : "Private"}</span>
                       </div>
                       <div className={`w-2 h-2 rounded-full ${published ? "bg-emerald-500" : "bg-amber-500"}`} />
                    </div>
                 </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Editor Wrapper */}
        <div className="relative pt-4">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
           <div className="py-8">
              <TipTapEditor ref={editorRef} content={initialData?.content} />
              {state.errors?.content && (
                <div className="flex items-center gap-2 text-destructive text-xs font-bold bg-destructive/5 px-3 py-1.5 rounded-lg w-fit mt-4">
                  <AlertCircle size={14} />
                  {state.errors.content[0]}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  )
}
