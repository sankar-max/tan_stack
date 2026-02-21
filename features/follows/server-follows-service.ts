"use server"

import { db } from "@/db"
import { follows } from "@/db/schema"
import { and, eq } from "drizzle-orm"
import { ok, fail } from "@/lib/api/response"
export async function followUser({
  followerId,
  followingId,
}: {
  followerId: string
  followingId: string
}) {
  const isAlreadyFollowed = await db.query.follows.findFirst({
    where: and(
      eq(follows.followerId, followerId),
      eq(follows.followingId, followingId),
    ),
  })
  if (isAlreadyFollowed) {
    try {
      const unfollow = await db
        .delete(follows)
        .where(
          and(
            eq(follows.followerId, followerId),
            eq(follows.followingId, followingId),
          ),
        )
        .returning()

      return ok(unfollow, "Unfollowed successfully", 200)
    } catch {
      return fail("Failed to unfollow", 500, "INTERNAL_SERVER_ERROR")
    }
  }
  try {
    const follow = await db
      .insert(follows)
      .values({
        followerId,
        followingId,
      })
      .returning()
    return ok(follow, "Followed successfully", 200)
  } catch {
    return fail("Failed to follow", 500, "INTERNAL_SERVER_ERROR")
  }
}
