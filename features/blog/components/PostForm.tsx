"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import TipTapEditor, { TipTapEditorRef } from "./PostEditor"
import type { PostState } from "../actions"
import { useRef, useState } from "react"
import { Loader2, Sparkles, Eye, EyeOff, BookOpen, Save, Send } from "lucide-react"
import { Switch } from "@/components/ui/switch"

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
    <div className="min-h-screen bg-background">
      {/* ── Sticky Top Bar ── */}
      <div className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Left: breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">
              {isEditing ? "Editing story" : "New story"}
            </span>
            {title && (
              <>
                <span className="hidden sm:inline text-border">·</span>
                <span className="hidden sm:inline truncate max-w-[180px] text-foreground/70 font-medium">
                  {title}
                </span>
              </>
            )}
          </div>

          {/* Right: controls */}
          <div className="flex items-center gap-3">
            {/* Publish toggle */}
            <button
              type="button"
              onClick={() => setPublished(!published)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold
                border transition-all duration-300 cursor-pointer select-none
                ${published
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  : "bg-muted border-border text-muted-foreground hover:text-foreground"
                }
              `}
            >
              {published ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
              {published ? "Public" : "Draft"}
              <Switch
                id="published"
                checked={published}
                onCheckedChange={setPublished}
                className="scale-75 pointer-events-none ml-1"
              />
            </button>

            {/* Submit button */}
            <form action={handleSubmit}>
              <Button
                type="submit"
                disabled={isPending}
                className={`
                  relative overflow-hidden h-9 px-5 rounded-full text-sm font-semibold
                  transition-all duration-300 shadow-lg hover:shadow-xl
                  disabled:opacity-60
                  ${published
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white border-0"
                    : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white border-0"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : published ? (
                    <Send className="w-4 h-4" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isPending
                    ? "Saving…"
                    : published
                    ? (isEditing ? "Update & Publish" : "Publish Story")
                    : (isEditing ? "Save Draft" : submitLabel)
                  }
                </span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <form action={handleSubmit} className="max-w-3xl mx-auto px-6 pt-12 pb-32 space-y-0">

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-8">
          <span className={`
            inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
            ${published
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }
          `}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${published ? "bg-emerald-500" : "bg-amber-500"}`} />
            {published ? "Will be published" : "Draft"}
          </span>
          <span className="text-xs text-muted-foreground">
            {isEditing ? "Editing existing story" : "Writing new story"}
          </span>
        </div>

        {/* Title */}
        <div className="group mb-4">
          <Input
            name="title"
            placeholder="Your story title…"
            className="
              w-full text-4xl sm:text-5xl font-bold tracking-tight leading-tight
              border-none shadow-none bg-transparent px-0 py-2 h-auto
              focus-visible:ring-0 focus-visible:outline-none
              placeholder:text-muted-foreground/30
              text-foreground
              resize-none
            "
            required
            minLength={3}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            {state.errors?.title && (
              <p className="text-sm text-destructive">{state.errors.title}</p>
            )}
            <span className="ml-auto text-xs text-muted-foreground/50 tabular-nums">
              {title.length} chars
            </span>
          </div>
          <div className="h-px bg-gradient-to-r from-border via-border/30 to-transparent mt-2 group-focus-within:from-violet-400 group-focus-within:via-violet-200 transition-all duration-500" />
        </div>

        {/* Excerpt */}
        <div className="group mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-muted-foreground/50" />
            <span className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
              Short excerpt
            </span>
            <span className="text-xs text-muted-foreground/40">(optional · shown in previews)</span>
          </div>
          <Textarea
            name="excerpt"
            placeholder="Write a compelling summary that makes readers want to read more…"
            className="
              w-full resize-none border-none shadow-none bg-transparent px-0
              text-base text-muted-foreground leading-relaxed
              focus-visible:ring-0 focus-visible:outline-none
              placeholder:text-muted-foreground/30
              min-h-[72px]
            "
            maxLength={300}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
          <div className="flex items-center justify-between mt-1">
            {state.errors?.excerpt && (
              <p className="text-sm text-destructive">{state.errors.excerpt}</p>
            )}
            <div className="ml-auto flex items-center gap-1">
              <div
                className="h-1 rounded-full bg-muted overflow-hidden w-16"
                title={`${excerpt.length}/300 characters`}
              >
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    excerpt.length > 250 ? "bg-amber-500" : "bg-violet-500"
                  }`}
                  style={{ width: `${(excerpt.length / 300) * 100}%` }}
                />
              </div>
              <span className="text-xs text-muted-foreground/50 tabular-nums">
                {excerpt.length}/300
              </span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-border via-border/30 to-transparent mt-2 group-focus-within:from-violet-400 group-focus-within:via-violet-200 transition-all duration-500" />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-border/50" />
          <div className="flex gap-1">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            ))}
          </div>
          <div className="flex-1 h-px bg-border/50" />
        </div>

        {/* Rich Text Editor */}
        <div className="min-h-[500px]">
          <TipTapEditor ref={editorRef} content={initialData?.content} />
          {state.errors?.content && (
            <p className="text-sm text-destructive mt-2">{state.errors.content}</p>
          )}
        </div>

        {/* Global error */}
        {state.message && (
          <div className="mt-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/20">
            <div className="w-2 h-2 rounded-full bg-destructive flex-shrink-0" />
            <p className="text-sm text-destructive font-medium">{state.message}</p>
          </div>
        )}
      </form>
    </div>
  )
}
