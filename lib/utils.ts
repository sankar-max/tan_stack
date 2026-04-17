import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for the application.
 * Priority: NEXT_PUBLIC_BASE_URL > VERCEL_URL > NEXT_PUBLIC_BETTER_AUTH_URL > localhost:3000
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // In the browser, use the current origin
    return window.location.origin
  }

  // Server-side: prefer explicit public base URL first
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL

  // VERCEL_URL is automatically set by Vercel on every deployment
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`

  // Auth URL as last resort (may be localhost in dev)
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL)
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL

  // Default for local development
  return "http://localhost:3000"
}
