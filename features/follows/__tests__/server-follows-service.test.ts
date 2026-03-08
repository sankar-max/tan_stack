import { describe, it, expect, vi, beforeEach } from "vitest"
import { followUser } from "../server-follows-service"
import { db } from "@/db"
import { ApiResponse } from "@/lib/api/api-response"

// --- Drizzle Mock Helper ---
interface MockDrizzleChain<T> {
  where: (condition: unknown) => MockDrizzleChain<T>
  values: (vals: unknown) => MockDrizzleChain<T>
  returning: () => MockDrizzleChain<T>
  then: <TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null,
  ) => Promise<TResult1 | TResult2>
}

function createMockChain<T>(resolvedValue: T): MockDrizzleChain<T> {
  const chain: MockDrizzleChain<T> = {
    where: () => chain,
    values: () => chain,
    returning: () => chain,
    then: (onfulfilled) => Promise.resolve(resolvedValue).then(onfulfilled),
  }
  return chain
}

vi.mock("@/db", () => ({
  db: {
    query: {
      follows: {
        findFirst: vi.fn(),
      },
    },
    delete: vi.fn(),
    insert: vi.fn(),
  },
}))

// Define a type for our mock response to avoid 'any'
interface MockResponse<T> {
  success: boolean
  data: T
  message: string
  status: number
  json: () => Promise<ApiResponse<T>>
}

// Mock the response helpers to ensure we get predictable objects
vi.mock("@/lib/api/response", () => ({
  ok: vi.fn((data: unknown, message: string, status: number) => ({
    success: true,
    data,
    message,
    status,
    json: async () => ({
      success: true,
      data,
      message,
      status,
    }),
  })),
  fail: vi.fn((message: string, status: number, code: string) => ({
    success: false,
    message,
    status,
    code,
    json: async () => ({
      success: false,
      message,
      status,
      code,
    }),
  })),
}))

describe("followUser service", () => {
  const ids = { followerId: "u1", followingId: "u2" }

  beforeEach(() => {
    vi.clearAllMocks()

    // Using strictly typed ReturnType for mock chains
    vi.mocked(db.delete).mockReturnValue(
      createMockChain([ids]) as unknown as ReturnType<typeof db.delete>,
    )
    vi.mocked(db.insert).mockReturnValue(
      createMockChain([ids]) as unknown as ReturnType<typeof db.insert>,
    )
  })

  it("unfollows if already following", async () => {
    vi.mocked(db.query.follows.findFirst).mockResolvedValue(ids)

    const result = (await followUser(ids)) as unknown as MockResponse<
      { followerId: string; followingId: string }[]
    >
    const body = await result.json()

    expect(body.success).toBe(true)
    expect(body.message).toBe("Unfollowed successfully")
  })

  it("follows if not already following", async () => {
    vi.mocked(db.query.follows.findFirst).mockResolvedValue(undefined)

    const result = (await followUser(ids)) as unknown as MockResponse<
      { followerId: string; followingId: string }[]
    >
    const body = await result.json()

    expect(body.success).toBe(true)
    expect(body.message).toBe("Followed successfully")
  })

  it("handles database errors gracefully", async () => {
    vi.mocked(db.query.follows.findFirst).mockResolvedValue(undefined)
    vi.mocked(db.insert).mockImplementation(() => {
      throw new Error("Insert failed")
    })

    const result = (await followUser(ids)) as unknown as MockResponse<never>
    const body = await result.json()
    expect(body.success).toBe(false)
    expect(body.message).toBe("Failed to follow")
  })
})
