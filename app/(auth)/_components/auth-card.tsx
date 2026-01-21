"use client"
import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AuthCardProps {
  children: React.ReactNode
  className?: string
  title: string
  description: string
}

export function AuthCard({ children, className, title, description }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "w-full max-w-md mx-auto",
        "relative p-1 rounded-2xl overflow-hidden",
        "bg-linear-to-br from-primary/20 via-transparent to-primary/10",
        className
      )}
    >
      <div className="absolute inset-0 bg-background/60 backdrop-blur-xl -z-10" />
      <div className="p-8 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground bg-linear-to-r from-foreground to-foreground/70 bg-clip-text">
            {title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
        {children}
      </div>
    </motion.div>
  )
}
