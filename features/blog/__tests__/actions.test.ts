import { describe, it, expect, vi } from "vitest"
import {
  createPost,
  updatePost,
  deletePost,
  getPublicPosts,
  searchPosts,
} from "../actions"
import { postService } from "../services"
import { auth } from "@/lib/auth"
import { db } from "@/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { PostListItemsT } from "../types"

// --- Mocks for Next.js ---
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }))
vi.mock("next/navigation", () => ({ redirect: vi.fn() }))
vi.mock("next/headers", () => ({
  headers: vi.fn().mockResolvedValue(new Headers()),
}))

// --- Drizzle Mock Helper ---
// Using a more robust chain that satisfies Drizzle's Thenable interface
interface MockDrizzleChain<T> {
  from: (table: unknown) => MockDrizzleChain<T>
  leftJoin: (table: unknown, condition: unknown) => MockDrizzleChain<T>
  where: (condition: unknown) => MockDrizzleChain<T>
  orderBy: (order: unknown) => MockDrizzleChain<T>
  limit: (count: number) => MockDrizzleChain<T>
  then: <TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) => Promise<TResult1 | TResult2>
  catch: <TResult = never>(
    onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null,
  ) => Promise<T | TResult>
  finally: (onfinally?: (() => void) | null) => Promise<T>
}

function createMockChain<T>(resolvedValue: T): MockDrizzleChain<T> {
  const chain: MockDrizzleChain<T> = {
    from: () => chain,
    leftJoin: () => chain,
    where: () => chain,
    orderBy: () => chain,
    limit: () => chain,
    then: (onfulfilled) => Promise.resolve(resolvedValue).then(onfulfilled),
    catch: (onrejected) => Promise.resolve(resolvedValue).catch(onrejected),
    finally: (onfinally) => Promise.resolve(resolvedValue).finally(onfinally),
  }
  return chain
}

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(),
    execute: vi.fn().mockResolvedValue({
      rows: [],
      command: "SELECT",
      rowCount: 0,
      oid: 0,
      fields: [],
    }),
  },
}))

// --- Auth Mock ---
vi.mock("@/lib/auth", () => ({
  auth: { api: { getSession: vi.fn() } },
}))

// --- Service Mock ---
vi.mock("../services", () => ({
  postService: {
    createPost: vi.fn(),
    updatePost: vi.fn(),
    deletePost: vi.fn(),
  },
}))

// --- Mock Data ---
const MOCK_SESSION = {
  user: {
    id: "user_123",
    name: "Test User",
    email: "test@example.com",
    emailVerified: true,
    role: "user",
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  session: {
    id: "session_123",
    token: "fake_token",
    userId: "user_123",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    ipAddress: null,
    userAgent: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

const MOCK_POST: PostListItemsT = {
  id: 1,
  title: "Mastering Vitest",
  slug: "mastering-vitest",
  content: "This is deep level testing.",
  excerpt: null,
  published: true,
  authorId: "user_123",
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  author: {
    id: "user_123",
    name: "Test User",
    image: null,
  },
  totalLikes: 0,
  totalComments: 0,
  isLiked: false,
  isFollowing: false,
}

// Data matching the specific selection in getPublicPosts/searchPosts
const MOCK_PUBLIC_POST = {
  id: 1,
  title: "Mastering Vitest",
  slug: "mastering-vitest",
  excerpt: null,
  createdAt: new Date(),
  authorName: "Test User",
  authorImage: null,
}

describe("Blog Server Actions", () => {
  describe("createPost", () => {
    it("should return Unauthorized if no session exists", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)
      const formData = new FormData()
      const result = await createPost({}, formData)
      expect(result).toEqual({ message: "Unauthorized" })
    })

    it("should redirect on successful creation", async () => {
      // Correcting the cast to be exactly what Awaited return expects
      vi.mocked(auth.api.getSession).mockResolvedValue(
        MOCK_SESSION as unknown as Awaited<
          ReturnType<typeof auth.api.getSession>
        >,
      )

      vi.mocked(postService.createPost).mockResolvedValue({
        success: true,
        status: 201,
        message: "Post created successfully",
        data: MOCK_POST,
      })

      const formData = new FormData()
      formData.append("title", "Mastering Vitest")
      formData.append("content", "This is deep level testing.")
      formData.append("published", "true")

      await createPost({}, formData)

      expect(revalidatePath).toHaveBeenCalledWith("/blog")
      expect(redirect).toHaveBeenCalledWith("/dashboard/posts")
    })
  })

  describe("getPublicPosts", () => {
    it("returns success response", async () => {
      // Returning the correct flat structure for public methods
      vi.mocked(db.select).mockReturnValue(
        createMockChain([MOCK_PUBLIC_POST]) as unknown as ReturnType<
          typeof db.select
        >,
      )

      const result = await getPublicPosts(1)
      expect(result.status).toBe("success")
    })
  })

  describe("searchPosts", () => {
    it("returns empty for blank query", async () => {
      const result = await searchPosts({ query: "" })
      expect(result.data).toEqual([])
    })

    it("returns matching posts for valid query", async () => {
      vi.mocked(db.select).mockReturnValue(
        createMockChain([MOCK_PUBLIC_POST]) as unknown as ReturnType<
          typeof db.select
        >,
      )
      const result = await searchPosts({ query: "Vitest" })
      expect(result.status).toBe("success")
      expect(result.data).toHaveLength(1)
    })
  })

  describe("updatePost", () => {
    it("should return Unauthorized if no session exists", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)
      const formData = new FormData()
      const result = await updatePost("1", {}, formData)
      expect(result).toEqual({ message: "Unauthorized" })
    })

    it("should redirect on successful update", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(
        MOCK_SESSION as unknown as Awaited<
          ReturnType<typeof auth.api.getSession>
        >,
      )

      vi.mocked(postService.updatePost).mockResolvedValue({
        success: true,
        status: 200,
        message: "Post updated successfully",
        data: MOCK_POST,
      })

      const formData = new FormData()
      formData.append("title", "Updated Title")
      formData.append("content", "Updated Content")

      await updatePost("1", {}, formData)

      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/posts")
      expect(redirect).toHaveBeenCalledWith("/dashboard/posts")
    })
  })

  describe("deletePost", () => {
    it("should return Unauthorized if no session exists", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)
      const result = await deletePost("1")
      expect(result).toEqual({ message: "Unauthorized" })
    })

    it("should return success message on deletion", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(
        MOCK_SESSION as unknown as Awaited<
          ReturnType<typeof auth.api.getSession>
        >,
      )

      vi.mocked(postService.deletePost).mockResolvedValue({
        success: true,
        status: 200,
        message: "Post deleted successfully",
        data: undefined as unknown as void,
      })

      const result = await deletePost("1")

      expect(result).toEqual({ message: "Post deleted successfully" })
      expect(revalidatePath).toHaveBeenCalledWith("/dashboard/posts")
    })
  })
})
