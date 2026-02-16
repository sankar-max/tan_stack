import { db } from "@/db"
import { comments, postLikes, posts } from "@/db/schema/blog.schema"
import { user } from "@/db/schema/auth.schema"
import { and, ilike, sql, desc, asc, eq } from "drizzle-orm"

/**
 * Server-side service for Blog feature.
 * Encapsulates direct database operations.
 */
export const postServiceServer = {
  async getPosts({
    page,
    limit,
    search,
    sort,
    order,
    authorId,
    published,
    currentUserId,
  }: {
    page: number
    limit: number
    search?: string
    sort: "createdAt" | "title" | "updatedAt"
    order: "asc" | "desc"
    authorId?: string
    published?: boolean
    currentUserId?: string | null
  }) {
    const offset = (page - 1) * limit

    const where = and(
      search ? ilike(posts.title, `%${search}%`) : undefined,
      authorId ? eq(posts.authorId, authorId) : undefined,
      published === true ? eq(posts.published, true) : undefined,
      // If authorId is provided (Dashboard), show all (drafts + published) unless filtered.
      // If no authorId (Public Feed), force published=true.
      !authorId ? eq(posts.published, true) : undefined,
    )

    const orderBy = order === "asc" ? asc(posts[sort]) : desc(posts[sort])
    const userId = currentUserId

    const [data, totalResult] = await Promise.all([
      db
        .select({
          id: posts.id,
          title: posts.title,
          slug: posts.slug,
          excerpt: posts.excerpt,
          content: posts.content,
          published: posts.published,
          createdAt: posts.createdAt,
          updatedAt: posts.updatedAt,
          author: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
          totalLikes:
            sql<number>`(select count(*) from ${postLikes} where ${postLikes.postId} = ${posts.id})`.mapWith(
              Number,
            ),
          totalComments:
            sql<number>`(select count(*) from ${comments} where ${comments.postId} = ${posts.id})`.mapWith(
              Number,
            ),
          isLiked: userId
            ? sql<boolean>`EXISTS (select 1 from ${postLikes} where ${postLikes.postId} = ${posts.id} and ${postLikes.userId} = ${userId})`
            : sql<boolean>`false`,
        })
        .from(posts)
        .leftJoin(user, eq(posts.authorId, user.id))
        .where(where)
        .limit(limit)
        .offset(offset)
        .orderBy(orderBy),
      db
        .select({ total: sql<number>`count(*)` })
        .from(posts)
        .where(where),
    ])

    const total = totalResult[0]?.total || 0

    return {
      posts: data,
      total: Number(total),
      totalPages: Math.ceil(Number(total) / limit),
    }
  },

  async getPost({
    postId,
    userId,
  }: {
    postId: number
    userId?: string | null
  }) {
    const [post] = await db
      .select({
        id: posts.id,
        title: posts.title,
        slug: posts.slug,
        excerpt: posts.excerpt,
        content: posts.content,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
        totalLikes:
          sql<number>`(select count(*) from ${postLikes} where ${postLikes.postId} = ${posts.id})`.mapWith(
            Number,
          ),
        totalComments:
          sql<number>`(select count(*) from ${comments} where ${comments.postId} = ${posts.id})`.mapWith(
            Number,
          ),
        isLiked: userId
          ? sql<boolean>`EXISTS (select 1 from ${postLikes} where ${postLikes.postId} = ${posts.id} and ${postLikes.userId} = ${userId})`
          : sql<boolean>`false`,
      })
      .from(posts)
      .leftJoin(user, eq(posts.authorId, user.id))
      .where(eq(posts.id, postId))
      .limit(1)

    return post
  },

  async createPost({
    title,
    content,
    excerpt,
    published,
    authorId,
  }: {
    title: string
    content: string
    excerpt?: string
    published: boolean
    authorId: string
  }) {
    // Simple slug generation
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
      "-" +
      Math.random().toString(36).substring(2, 7)

    const [newPost] = await db
      .insert(posts)
      .values({
        title,
        content,
        excerpt,
        published,
        authorId,
        slug,
      })
      .returning()

    return newPost
  },

  async toggleLike({ postId, userId }: { postId: number; userId: string }) {
    /**
     * Optimized Single Round-Trip Toggle using CTE
     */
    const query = sql`
      WITH 
        check_post AS (
          SELECT id FROM ${posts} WHERE ${posts.id} = ${postId}
        ),
        existing AS (
          SELECT 1 FROM ${postLikes} WHERE ${postLikes.postId} = ${postId} AND ${postLikes.userId} = ${userId}
        ),
        deleted AS (
          DELETE FROM ${postLikes} 
          WHERE ${postLikes.postId} = ${postId} AND ${postLikes.userId} = ${userId} 
          RETURNING 1
        ),
        inserted AS (
          INSERT INTO ${postLikes} (post_id, user_id)
          SELECT ${postId}, ${userId}
          WHERE EXISTS (SELECT 1 FROM check_post) 
            AND NOT EXISTS (SELECT 1 FROM existing)
          RETURNING 1
        )
      SELECT 
        EXISTS (SELECT 1 FROM check_post) as "postExists",
        EXISTS (SELECT 1 FROM inserted) as "isLiked",
        (SELECT count(*)::int FROM ${postLikes} WHERE ${postLikes.postId} = ${postId}) 
        + (SELECT count(*)::int FROM inserted) 
        - (SELECT count(*)::int FROM deleted) as "totalLikes"
    `

    const dbResult = await db.execute(query)
    const stats = dbResult.rows?.[0] as
      | {
          postExists: boolean
          isLiked: boolean
          totalLikes: number
        }
      | undefined

    return stats
  },

  async updatePost(
    id: string,
    data: {
      title?: string
      content?: string
      excerpt?: string
      published?: boolean
    },
  ) {
    const [updatedPost] = await db
      .update(posts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, Number(id))) // Assuming ID is number based on schema usage elsewhere, but strictly it might be serial
      .returning()

    return updatedPost
  },

  async deletePost(id: string) {
    await db.delete(posts).where(eq(posts.id, Number(id)))
    return true
  },

  async getPostLikes({
    postId,
    page,
    limit,
  }: {
    postId: number
    page: number
    limit: number
  }) {
    const offset = (page - 1) * limit

    const [totalLikesResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(postLikes)
      .where(eq(postLikes.postId, postId))

    const total = Number(totalLikesResult?.count ?? 0)

    const users = await db
      .select({
        id: user.id,
        name: user.name,
        image: user.image,
        email: user.email,
      })
      .from(postLikes)
      .innerJoin(user, eq(postLikes.userId, user.id))
      .where(eq(postLikes.postId, postId))
      .limit(limit)
      .offset(offset)

    return {
      users,
      total,
      totalPages: Math.ceil(total / limit),
    }
  },
}
