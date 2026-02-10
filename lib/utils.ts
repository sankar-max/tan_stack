import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get the base URL for the application.
 * Priority: window.location.origin > NEXT_PUBLIC_BASE_URL > VERCEL_URL > localhost:3000
 */
export function getBaseUrl() {
  if (typeof window !== "undefined") {
    // In the browser, we always want the current origin unless it's a specific debug case
    return window.location.origin
  }

  // Server-side
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) return process.env.NEXT_PUBLIC_BETTER_AUTH_URL
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL
  
  // VERCEL_URL is available in Vercel environment
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  
  // Default for local development
  return "http://localhost:3000"
}
