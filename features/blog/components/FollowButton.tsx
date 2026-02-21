import { Button } from "@/components/ui/button"
import { useFollow } from "@/features/follows/hooks/useFollow"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, UserMinus, UserPlus } from "lucide-react"
import React, { useState } from "react"

interface FollowButtonProps {
  userId: string
  isFollowing: boolean
}

export function FollowButton({ userId, isFollowing }: FollowButtonProps) {
  const { toggleFollow, isPending } = useFollow()
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFollow(userId)
      }}
      disabled={isPending}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative min-w-[100px] overflow-hidden transition-all duration-300",
        isFollowing
          ? "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-red-900/50 dark:hover:bg-red-900/20"
          : "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200",
        "h-9 px-4 py-2",
        "rounded-full font-medium shadow-sm hover:shadow-md active:scale-95",
      )}
      variant={isFollowing ? "outline" : "default"}
    >
      <AnimatePresence mode="wait">
        {isPending ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Processing...</span>
          </motion.div>
        ) : isFollowing ? (
          <motion.div
            key="following"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2"
          >
            {isHovered ? (
              <>
                <UserMinus className="h-4 w-4" />
                <span>Unfollow</span>
              </>
            ) : (
              <span>Following</span>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="follow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Follow</span>
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}
