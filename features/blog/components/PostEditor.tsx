"use client"

import { EditorContent, useEditor, type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Image from "@tiptap/extension-image"
import { useImperativeHandle, forwardRef, useCallback, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  Bold, Italic, Strikethrough, Code, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
  List, ListOrdered, Quote, Minus, Undo, Redo,
  ImageIcon, FileText, Loader2, Code2, Type, Eraser
} from "lucide-react"

interface TipTapEditorProps {
  content?: string
}

export interface TipTapEditorRef {
  getHTML: () => string
  getJSON: () => JSONContent | undefined
}

type ToolbarButtonProps = {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

function ToolbarButton({ onClick, active, disabled, title, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center w-8 h-8 rounded-md text-sm
        transition-all duration-150 cursor-pointer select-none
        disabled:opacity-30 disabled:cursor-not-allowed
        ${active
          ? "bg-foreground text-background shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }
      `}
    >
      {children}
    </button>
  )
}

function ToolbarDivider() {
  return <div className="w-px h-5 bg-border/60 mx-1 self-center shrink-0" />
}

const TipTapEditor = forwardRef<TipTapEditorRef, TipTapEditorProps>(
  ({ content = "" }, ref) => {
    const [isUploading, setIsUploading] = useState(false)
    const [stats, setStats] = useState({ words: 0, characters: 0 })

    const editor = useEditor({
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3, 4, 5, 6],
          },
        }),
        Placeholder.configure({
          placeholder: "Start writing your masterpiece… (use # for H1, ## for H2, - for lists)",
        }),
        Image.configure({
          inline: true,
          allowBase64: true,
        }),
      ],
      content,
      onUpdate: ({ editor }) => {
        const text = editor.getText()
        const words = text.split(/\s+/).filter(word => word.length > 0).length
        const characters = text.length
        setStats({ words, characters })
      },
      editorProps: {
        attributes: {
          class:
            "tiptap prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[420px] px-4 py-4 leading-relaxed",
        },
      },
    })

    // Initial stats
    useEffect(() => {
      if (editor) {
        const text = editor.getText()
        const words = text.split(/\s+/).filter(word => word.length > 0).length
        const characters = text.length
        setStats({ words, characters })
      }
    }, [editor])

    useImperativeHandle(ref, () => ({
      getHTML: () => editor?.getHTML() || "",
      getJSON: () => editor?.getJSON(),
    }))

    const addImage = useCallback(() => {
      const url = window.prompt("Enter image URL")
      if (url && editor) {
        editor.chain().focus().setImage({ src: url }).run()
      }
    }, [editor])

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return
      if (!file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
        toast.error("Only .txt and .md files are supported.")
        return
      }
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        const text = event.target?.result as string
        if (text && editor) {
          editor.chain().focus().insertContent(text).run()
          toast.success("File imported successfully")
        }
        setIsUploading(false)
      }
      reader.onerror = () => {
        toast.error("Failed to read file")
        setIsUploading(false)
      }
      reader.readAsText(file)
      e.target.value = ""
    }

    return (
      <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm transition-all duration-300 focus-within:shadow-md focus-within:border-border">

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 border-b border-border/50 bg-muted/30 overflow-x-auto">

          {/* Undo / Redo */}
          <ToolbarButton title="Undo" onClick={() => editor?.chain().focus().undo().run()} disabled={!editor?.can().undo()}>
            <Undo className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Redo" onClick={() => editor?.chain().focus().redo().run()} disabled={!editor?.can().redo()}>
            <Redo className="w-3.5 h-3.5" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text Styles */}
          <ToolbarButton title="Paragraph" active={editor?.isActive("paragraph")} onClick={() => editor?.chain().focus().setParagraph().run()}>
            <Type className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Clear Formatting" onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}>
            <Eraser className="w-3.5 h-3.5" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Headings */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5, 6].map((level) => (
              <ToolbarButton
                key={level}
                title={`Heading ${level}`}
                active={editor?.isActive("heading", { level: level as any })}
                onClick={() => editor?.chain().focus().toggleHeading({ level: level as any }).run()}
              >
                <span className="text-[10px] font-bold">H{level}</span>
              </ToolbarButton>
            ))}
          </div>

          <ToolbarDivider />

          {/* Text marks */}
          <ToolbarButton title="Bold" active={editor?.isActive("bold")} onClick={() => editor?.chain().focus().toggleBold().run()}>
            <Bold className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Italic" active={editor?.isActive("italic")} onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <Italic className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Strikethrough" active={editor?.isActive("strike")} onClick={() => editor?.chain().focus().toggleStrike().run()}>
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Inline code" active={editor?.isActive("code")} onClick={() => editor?.chain().focus().toggleCode().run()}>
            <Code className="w-3.5 h-3.5" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton title="Bullet list" active={editor?.isActive("bulletList")} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <List className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Numbered list" active={editor?.isActive("orderedList")} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="w-3.5 h-3.5" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Block elements */}
          <ToolbarButton title="Blockquote" active={editor?.isActive("blockquote")} onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
            <Quote className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Code block" active={editor?.isActive("codeBlock")} onClick={() => editor?.chain().focus().toggleCodeBlock().run()}>
            <Code2 className="w-3.5 h-3.5" />
          </ToolbarButton>
          <ToolbarButton title="Horizontal rule" onClick={() => editor?.chain().focus().setHorizontalRule().run()}>
            <Minus className="w-3.5 h-3.5" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Media */}
          <ToolbarButton title="Add image by URL" onClick={addImage} disabled={!editor}>
            <ImageIcon className="w-3.5 h-3.5" />
          </ToolbarButton>

          {/* File import */}
          <div className="relative">
            <button
              type="button"
              title="Import .txt or .md file"
              disabled={isUploading || !editor}
              className="
                inline-flex items-center justify-center w-8 h-8 rounded-md text-sm
                text-muted-foreground hover:text-foreground hover:bg-muted
                transition-all duration-150 cursor-pointer
                disabled:opacity-30 disabled:cursor-not-allowed
              "
            >
              {isUploading
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <FileText className="w-3.5 h-3.5" />
              }
            </button>
            <Input
              type="file"
              accept=".txt,.md"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileImport}
              disabled={isUploading || !editor}
            />
          </div>

          {/* Stats — right side */}
          <div className="ml-auto flex items-center gap-3 pr-2 text-[10px] text-muted-foreground/50 tabular-nums whitespace-nowrap self-center hidden sm:flex">
            <span>{stats.words} words</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>{stats.characters} chars</span>
          </div>
        </div>

        {/* ── Editor area ── */}
        <div className="relative min-h-[420px] bg-card">
          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-sm">Loading editor…</span>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  },
)

TipTapEditor.displayName = "TipTapEditor"

export default TipTapEditor
