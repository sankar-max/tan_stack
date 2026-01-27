import { requireUser } from "@/lib/requireAuth"
import { ok } from "../../lib/response"
import { parseSearchParams } from "../../_utilities/http/parse-search-params"
import { GetPostSchemaQuery } from "./schema"
import { zodError } from "../../lib/zod-error"
import { db } from "@/db"
import { posts } from "@/db/schema/blog.schema"
import { user } from "@/db/schema/auth.schema"
import { eq } from "drizzle-orm"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // await requireUser(req)
  const { id } = await params
  const result = GetPostSchemaQuery.safeParse({ id })
  if (!result.success) {
    return zodError(result.error)
  }

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
    })
    .from(posts)
    .leftJoin(user, eq(posts.authorId, user.id))
    .where(eq(posts.id, result.data.id))
    .limit(1)

  if (!post) {
    return ok(null, "Post not found", 404)
  }
  return ok(post)
}
