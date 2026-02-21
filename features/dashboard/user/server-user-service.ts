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

  const queries: {
    readonly _: { readonly dialect: "pg"; readonly result: unknown }
  }[] = []

  if (name || image) {
    queries.push(
      db
        .update(user)
        .set({
          ...(name ? { name } : {}),
          ...(image ? { image } : {}),
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId)),
    )
  }

  if (Object.keys(profileData).length > 0) {
    queries.push(
      db
        .insert(userProfile)
        .values({
          userId,
          ...profileData,
          updatedAt: new Date(),
        })
        .onConflictDoUpdate({
          target: userProfile.userId,
          set: {
            ...profileData,
            updatedAt: new Date(),
          },
        }),
    )
  }

  // Add the final fetch to the batch to perform everything in one round-trip
  const fetchQuery = db.query.user.findFirst({
    where: eq(user.id, userId),
    with: {
      profile: true,
    },
  })

  const results = await db.batch([...queries, fetchQuery] as unknown as [
    { readonly _: { readonly dialect: "pg"; readonly result: unknown } },
    ...{ readonly _: { readonly dialect: "pg"; readonly result: unknown } }[],
  ])

  return results[results.length - 1] as Awaited<ReturnType<typeof getUser>>
}
