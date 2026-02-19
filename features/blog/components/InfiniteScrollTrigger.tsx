"use client"

import { useEffect, useRef } from "react"
import { Loader2 } from "lucide-react"

interface InfiniteScrollTriggerProps {
  onIntersect: () => void
  isEnabled: boolean
  isFetching: boolean
  rootMargin?: string
}

export function InfiniteScrollTrigger({
  onIntersect,
  isEnabled,
  isFetching,
  rootMargin = "200px",
}: InfiniteScrollTriggerProps) {
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isEnabled || isFetching) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect()
        }
      },
      { rootMargin },
    )

    const currentTrigger = triggerRef.current
    if (currentTrigger) {
      observer.observe(currentTrigger)
    }

    return () => {
      if (currentTrigger) {
        observer.unobserve(currentTrigger)
      }
    }
  }, [onIntersect, isEnabled, isFetching, rootMargin])

  return (
    <div ref={triggerRef} className="flex justify-center py-4 w-full">
      {isFetching && (
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      )}
    </div>
  )
}
