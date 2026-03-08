import { describe, it, expect, vi, beforeEach } from "vitest"
import { cn, getBaseUrl } from "../utils"

describe("Utility functions", () => {
  describe("cn", () => {
    it("should resolve color conflicts", () => {
      expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500")
    })

    it("handles conditional classes", () => {
      expect(cn("p-4", false && "bg-blue-500")).toBe("p-4")
    })

    it("resolves tailwind conflicts", () => {
      expect(cn("p-4", "p-8")).toBe("p-8")
    })
  })

  describe("getBaseUrl", () => {
    beforeEach(() => {
      vi.stubEnv("VERCEL_URL", "")
      vi.stubEnv("NEXT_PUBLIC_BASE_URL", "")
      vi.stubGlobal("window", undefined)
    })

    it("returns localhost:3000 by default", () => {
      expect(getBaseUrl()).toBe("http://localhost:3000")
    })

    it("returns VERCEL_URL when set", () => {
      vi.stubEnv("VERCEL_URL", "example.vercel.app")
      expect(getBaseUrl()).toBe("https://example.vercel.app")
    })

    it("returns NEXT_PUBLIC_BASE_URL when set", () => {
      vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://example.com")
      expect(getBaseUrl()).toBe("https://example.com")
    })

    it("returns window.location.origin in browser", () => {
      vi.stubGlobal("window", {
        location: {
          origin: "https://browser.com",
        },
      })
      expect(getBaseUrl()).toBe("https://browser.com")
    })
  })
})
