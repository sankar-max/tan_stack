import { db } from "@/db";
import { postLikes, user } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import { ok, fail } from "@/app/api/lib/response";
import { parseSearchParams } from "@/app/api/_utilities/http/parse-search-params";
import { GetPostLikesQuerySchema } from "./schema";
import { zodError } from "@/app/api/lib/zod-error";

type PostLikeParams = {
 params: Promise<{
  id: string[];
 }>;
};

export default async function GET(
 req: NextRequest,
 { params }: PostLikeParams
) {
 try {
  const { id } = await params;
  const postId = parseInt(id[0]);

  if (isNaN(postId)) {
   return fail("Invalid post ID", 400);
  }

  const searchParams = parseSearchParams(req, GetPostLikesQuerySchema); // Validate query params
  if (!searchParams.success) {
   return zodError(searchParams.error);
  }

  const { page, limit } = searchParams.data;
  const offset = (page - 1) * limit;

  // specialized count query for better performance
  const [totalLikesResult] = await db
   .select({ count: sql<number>`count(*)` })
   .from(postLikes)
   .where(eq(postLikes.postId, postId));

  const total = Number(totalLikesResult?.count ?? 0);

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
   .offset(offset);

  return ok({
   total,
   users,
   pagination: {
    page,
    limit,
    totalPages: Math.ceil(total / limit),
   },
  });
 } catch (error) {
  console.error("Error fetching post likes:", error);
  return fail("Failed to fetch likes", 500);
 }
}