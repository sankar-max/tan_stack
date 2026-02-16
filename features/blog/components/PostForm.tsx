"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import TipTapEditor, { TipTapEditorRef } from "./PostEditor"
import { PostState } from "../actions"
import { useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface PostFormProps {
  initialData?: {
    id?: string
    title: string
    content: string
    published: boolean
    excerpt?: string | null
  }
  action: (prevState: PostState, formData: FormData) => Promise<PostState>
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

  const handleSubmit = (formData: FormData) => {
    const html = editorRef.current?.getHTML()
    if (html) {
      formData.append("content", html)
    }
    formData.set("published", published.toString())
    formAction(formData)
  }

  return (
    <form action={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-bold tracking-tight">
          {initialData ? "Edit Story" : "Write a Story"}
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={published}
              onCheckedChange={setPublished}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {published ? "Publish" : submitLabel}
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            name="title"
            placeholder="Story Title..."
            className="text-4xl font-serif font-bold border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50 h-auto py-4"
            required
            minLength={3}
            defaultValue={initialData?.title}
          />
          {state.errors?.title && (
            <p className="text-sm text-destructive mt-1">
              {state.errors.title}
            </p>
          )}
        </div>

        <div>
          <Textarea
            name="excerpt"
            placeholder="Short excerpt (optional)..."
            className="resize-none h-20 font-serif text-lg border-none shadow-none px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
            maxLength={300}
            defaultValue={initialData?.excerpt || ""}
          />
          {state.errors?.excerpt && (
            <p className="text-sm text-destructive mt-1">
              {state.errors.excerpt}
            </p>
          )}
        </div>

        <div className="min-h-[500px]">
          <TipTapEditor ref={editorRef} content={initialData?.content} />
          {state.errors?.content && (
            <p className="text-sm text-destructive mt-1">
              {state.errors.content}
            </p>
          )}
        </div>
      </div>
      {state.message && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}
    </form>
  )
}
