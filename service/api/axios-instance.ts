import { env } from "@/lib/env"
import { getBaseUrl } from "@/lib/utils"
import axios from "axios"

const baseURL = env.NEXT_PUBLIC_BASE_URL || getBaseUrl()

/**
 * Standardized Axios instance for the application.
 * Configured with baseURL and withCredentials for BetterAuth session support.
 */
export const apiInstance = axios.create({
  baseURL: `${baseURL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Required for cross-site cookie passing in BetterAuth
})

// Optional: Add request interceptor for things like JWT if not using session cookies
// apiInstance.interceptors.request.use((config) => {
//   return config;
// });
