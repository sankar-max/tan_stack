import { db } from "@/db"
import { comments, postLikes, posts } from "@/db/schema/blog.schema"
import { user } from "@/db/schema/auth.schema"
import { and, ilike, sql, desc, eq, lt } from "drizzle-orm"


export const postServiceServer = {

  async getPostBySlug(slug: string) {
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
      })
      .from(posts)
      .leftJoin(user, eq(posts.authorId, user.id))
      .where(eq(posts.slug, slug))
      .limit(1)

    return post
  },

  async getPosts({
    cursor,
    limit,
    search,
    authorId,
    published,
    currentUserId,
  }: {
    cursor?: number
    limit: number
    search?: string
    sort?: "createdAt" | "title" | "updatedAt"
    order?: "asc" | "desc"
    authorId?: string
    published?: boolean
    currentUserId?: string | null
  }) {
    const where = and(
      search ? ilike(posts.title, `%${search}%`) : undefined,
      authorId ? eq(posts.authorId, authorId) : undefined,
      published === true ? eq(posts.published, true) : undefined,
      !authorId ? eq(posts.published, true) : undefined,
      cursor ? lt(posts.id, cursor) : undefined
    )

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
          authorId: posts.authorId,
          deletedAt: posts.deletedAt,
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
        .limit(limit + 1)
        .orderBy(desc(posts.id)),
      db
        .select({ total: sql<number>`count(*)` })
        .from(posts)
        .where(where),
    ])

    const total = totalResult[0]?.total || 0
    const hasNextPage = data.length > limit
    const postsResult = hasNextPage ? data.slice(0, limit) : data
    const nextCursor = hasNextPage ? postsResult[postsResult.length - 1].id : null

    return {
      posts: postsResult,
      nextCursor,
      total: Number(total),
      limit,
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
    cursor,
    limit,
  }: {
    postId: number
    cursor?: string
    limit: number
  }) {
    const where = and(
      eq(postLikes.postId, postId),
      cursor ? lt(postLikes.createdAt, new Date(cursor)) : undefined
    )

    const [users, totalResult] = await Promise.all([
      db
        .select({
          id: user.id,
          name: user.name,
          image: user.image,
          email: user.email,
          createdAt: postLikes.createdAt,
        })
        .from(postLikes)
        .innerJoin(user, eq(postLikes.userId, user.id))
        .where(where)
        .limit(limit + 1)
        .orderBy(desc(postLikes.createdAt)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(postLikes)
        .where(eq(postLikes.postId, postId)),
    ])

    const total = Number(totalResult[0]?.count ?? 0)

    const hasNextPage = users.length > limit
    const usersResult = hasNextPage ? users.slice(0, limit) : users
    const nextCursor = hasNextPage ? usersResult[usersResult.length - 1].createdAt.toISOString() : null

    return {
      users: usersResult,
      nextCursor,
      total,
    }
  },

  async getPostComments({
    postId,
    cursor,
    limit,
  }: {
    postId: number
    cursor?: number
    limit: number
  }) {
    const where = and(
      eq(comments.postId, postId),
      cursor ? lt(comments.id, cursor) : undefined
    )

    const [postComments, totalResult] = await Promise.all([
      db
        .select({
          id: comments.id,
          content: comments.content,
          createdAt: comments.createdAt,
          updatedAt: comments.updatedAt,
          author: {
            id: user.id,
            name: user.name,
            image: user.image,
          },
        })
        .from(comments)
        .innerJoin(user, eq(comments.authorId, user.id))
        .where(where)
        .limit(limit + 1)
        .orderBy(desc(comments.id)),
      db
        .select({ count: sql<number>`count(*)` })
        .from(comments)
        .where(eq(comments.postId, postId)),
    ])

    const total = Number(totalResult[0]?.count ?? 0)

    const hasNextPage = postComments.length > limit
    const commentsResult = hasNextPage ? postComments.slice(0, limit) : postComments
    const nextCursor = hasNextPage ? commentsResult[commentsResult.length - 1].id : null

    return {
      comments: commentsResult,
      nextCursor,
      total,
    }
  },

  async createPostComment({
    postId,
    userId,
    content,
  }: {
    postId: number
    userId: string
    content: string
  }) {
    const [newComment] = await db
      .insert(comments)
      .values({
        postId,
        authorId: userId,
        content,
      })
      .returning()
    return newComment
  }
}
