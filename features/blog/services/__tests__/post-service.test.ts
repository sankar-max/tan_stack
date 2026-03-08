import { describe, it, expect, vi, beforeEach } from "vitest"
import { postServiceServer } from "../server-post-service"
import { db } from "@/db"

// --- Drizzle Mock Helper ---
interface MockDrizzleChain<T> {
  from: (table: unknown) => MockDrizzleChain<T>
  leftJoin: (table: unknown, condition: unknown) => MockDrizzleChain<T>
  innerJoin: (table: unknown, condition: unknown) => MockDrizzleChain<T>
  where: (condition: unknown) => MockDrizzleChain<T>
  limit: (count: number) => MockDrizzleChain<T>
  orderBy: (order: unknown) => MockDrizzleChain<T>
  values: (vals: unknown) => MockDrizzleChain<T>
  set: (vals: unknown) => MockDrizzleChain<T>
  returning: () => MockDrizzleChain<T>
  then: <TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) => Promise<TResult1 | TResult2>
}

function createMockChain<T>(resolvedValue: T): MockDrizzleChain<T> {
  const chain: MockDrizzleChain<T> = {
    from: () => chain,
    leftJoin: () => chain,
    innerJoin: () => chain,
    where: () => chain,
    limit: () => chain,
    orderBy: () => chain,
    values: () => chain,
    set: () => chain,
    returning: () => chain,
    then: (onfulfilled) => Promise.resolve(resolvedValue).then(onfulfilled),
  }
  return chain
}

vi.mock("@/db", () => ({
  db: {
    select: vi.fn(),
    from: vi.fn(),
    leftJoin: vi.fn(),
    innerJoin: vi.fn(),
    where: vi.fn(),
    limit: vi.fn(),
    orderBy: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    execute: vi.fn(),
    query: {
      follows: { findFirst: vi.fn() },
    },
  },
}))

// --- Mock Data ---
const MOCK_DB_POST = {
  id: 1,
  title: "Slug Post",
  slug: "slug-post",
  content: "Content",
  excerpt: null,
  published: true,
  authorId: "u1",
  createdAt: new Date(),
  updatedAt: new Date(),
  author: {
    id: "u1",
    name: "Author",
    image: null,
  },
  totalLikes: 0,
  totalComments: 0,
  isFollowing: false,
}

describe("postServiceServer", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe("getPostBySlug", () => {
    it("fetches a single post with author and counts", async () => {
      vi.mocked(db.select).mockReturnValue(
        createMockChain([MOCK_DB_POST]) as unknown as ReturnType<
          typeof db.select
        >,
      )

      const result = await postServiceServer.getPostBySlug("test-slug")
      expect(result).toEqual(MOCK_DB_POST)
    })
  })

  describe("getPosts", () => {
    it("handles complex filtering and pagination", async () => {
      const mockPosts = [MOCK_DB_POST]
      const mockTotal = [{ total: 1 }]

      vi.mocked(db.select)
        .mockReturnValueOnce(
          createMockChain(mockPosts) as unknown as ReturnType<typeof db.select>,
        )
        .mockReturnValueOnce(
          createMockChain(mockTotal) as unknown as ReturnType<typeof db.select>,
        )

      const result = await postServiceServer.getPosts({ limit: 10 })

      expect(result.posts).toHaveLength(1)
      expect(result.total).toBe(1)
    })
  })

  describe("toggleLike", () => {
    it("executes the complex CTE query and returns stats", async () => {
      const mockStats = { postExists: true, isLiked: true, totalLikes: 5 }
      vi.mocked(db.execute).mockResolvedValue({
        rows: [mockStats],
        command: "SELECT",
        rowCount: 1,
        fields: [],
        rowAsArray: false,
      })

      const result = await postServiceServer.toggleLike({
        postId: 1,
        userId: "u1",
      })
      expect(result).toEqual(mockStats)
    })
  })

  describe("createPost", () => {
    it("generates a slug and inserts the post", async () => {
      const input = {
        title: "Senior Testing",
        content: "Deep content",
        published: true,
        authorId: "u1",
      }
      vi.mocked(db.insert).mockReturnValue(
        createMockChain([
          { ...MOCK_DB_POST, title: input.title, slug: "senior-testing-abc" },
        ]) as unknown as ReturnType<typeof db.insert>,
      )

      const result = await postServiceServer.createPost(input)
      expect(result.id).toBe(1)
    })
  })

  describe("createPostComment", () => {
    it("inserts a new comment", async () => {
      const mockComment = {
        id: 10,
        content: "Nice post",
        postId: 1,
        authorId: "u1",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      vi.mocked(db.insert).mockReturnValue(
        createMockChain([mockComment]) as unknown as ReturnType<
          typeof db.insert
        >,
      )

      const result = await postServiceServer.createPostComment({
        postId: 1,
        userId: "u1",
        content: "Nice post",
      })
      expect(result).toEqual(mockComment)
    })
  })
})
