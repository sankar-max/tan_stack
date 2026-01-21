"use client"

import { EditorContent, useEditor, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import { useImperativeHandle, forwardRef } from "react"

interface TipTapEditorProps {
  content?: string
}

export interface TipTapEditorRef {
  getHTML: () => string
  getJSON: () => JSONContent | undefined
}

const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(({ content = "" }, ref) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write something amazing..." }),
    ],
    content,
    editorProps: {
      attributes: { class: "prose prose-invert max-w-none focus:outline-none" },
    },
  })

  useImperativeHandle(ref, () => ({
    getHTML: () => editor?.getHTML() || "",
    getJSON: () => editor?.getJSON(),
  }))

  return (
    <EditorContent
      editor={editor}
      className="min-h-[300px] p-4 border rounded-md"
    />
  )
})

TipTapEditor.displayName = "TipTapEditor"

export default TipTapEditor
