"use server"

import { db } from "@/db"
import { user, userProfile } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getUser({ userId }: { userId: string }) {
  const userData = await db.query.user.findFirst({
    where: eq(user.id, userId),
    with: {
      profile: true,
    },
  })
  return userData
}

export async function updateUser({
  userId,
  data,
}: {
  userId: string
  data: {
    name?: string
    image?: string
    bio?: string
    website?: string | null
    location?: string | null
    jobTitle?: string | null
    company?: string | null
  }
}) {
  const { name, image, ...profileData } = data

  await db.transaction(async (tx) => {
    if (name || image) {
      await tx
        .update(user)
        .set({
          ...(name ? { name } : {}),
          ...(image ? { image } : {}),
        })
        .where(eq(user.id, userId))
    }

    if (Object.keys(profileData).length > 0) {
      // Check if profile exists
      const existingProfile = await tx.query.userProfile.findFirst({
        where: eq(userProfile.userId, userId),
      })

      if (existingProfile) {
        await tx
          .update(userProfile)
          .set(profileData)
          .where(eq(userProfile.userId, userId))
      } else {
        await tx.insert(userProfile).values({
          userId,
          ...profileData,
        })
      }
    }
  })

  return getUser({ userId })
}
