import { describe, it, expect, vi } from "vitest"
import { requireUser, getCurrentUser } from "../requireAuth"
import { auth } from "@/lib/auth"

// --- Auth Mock ---
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}))

// Define a compatible Session type that matches the actual ReturnType closely
// to satisfy TypeScript in the implementation.
const MOCK_SESSION_FOR_AUTH = {
  user: {
    id: "user_123",
    email: "test@example.com",
    name: "Test User",
    image: null,
    emailVerified: true,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  session: {
    id: "session_123",
    userId: "user_123",
    expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    token: "fake_token",
    ipAddress: null,
    userAgent: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
}

describe("Auth Utilities (requireAuth)", () => {
  const mockUser = MOCK_SESSION_FOR_AUTH.user

  describe("requireUser", () => {
    it("returns user when session exists", async () => {
      // Use strictly typed ReturnType to avoid 'any'
      vi.mocked(auth.api.getSession).mockResolvedValue(
        MOCK_SESSION_FOR_AUTH as unknown as Awaited<
          ReturnType<typeof auth.api.getSession>
        >,
      )

      const req = new Request("http://localhost:3000")
      const result = await requireUser(req)
      expect(result).toEqual({ user: mockUser })
    })

    it("returns error response when no session exists", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)
      const req = new Request("http://localhost:3000")
      const result = await requireUser(req)
      expect(result.error).toBeDefined()
      expect(result.error).toBeInstanceOf(Response)
      expect(result.error?.status).toBe(401)
    })
  })

  describe("getCurrentUser", () => {
    it("skips DB check if no auth indicators are present", async () => {
      vi.mocked(auth.api.getSession).mockClear()

      const req = new Request("http://localhost:3000")
      const result = await getCurrentUser(req)
      expect(result).toBeNull()
      expect(auth.api.getSession).not.toHaveBeenCalled()
    })

    it("performs check if cookie is present", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(
        MOCK_SESSION_FOR_AUTH as unknown as Awaited<
          ReturnType<typeof auth.api.getSession>
        >,
      )

      const req = new Request("http://localhost:3000", {
        headers: {
          cookie: "better-auth.session_token=abc",
        },
      })
      const result = await getCurrentUser(req)
      expect(result).toEqual(mockUser)
      expect(auth.api.getSession).toHaveBeenCalled()
    })

    it("returns null if session is invalid despite having cookie", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null)
      const req = new Request("http://localhost:3000", {
        headers: {
          cookie: "better-auth.session_token=abc",
        },
      })
      const result = await getCurrentUser(req)
      expect(result).toBeNull()
    })
  })
})
