import axios, { AxiosError } from "axios"
import { toast } from "sonner"
import { ApiFailure } from "@/lib/api/api-response"

/**
 * Global API error handler.
 * Parses the structured ApiFailure response and shows relevant toast notifications.
 */
export const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiFailure>
    const responseData = axiosError.response?.data

    // Handle structured ApiFailure responses from our API
    if (responseData && responseData.success === false) {
      const { message, code, errors } = responseData

      switch (code) {
        case "VALIDATION_ERROR":
          if (errors) {
            const firstErrorField = Object.keys(errors)[0]
            const firstErrorMessage = errors[firstErrorField][0]
            toast.error(`${message}: ${firstErrorMessage}`)
          } else {
            toast.error(message)
          }
          break
        case "UNAUTHORIZED":
          toast.error("Session expired. Please sign in again.")
          break
        case "FORBIDDEN":
          toast.error("You don't have permission to perform this action.")
          break
        default:
          toast.error(message || "An unexpected error occurred.")
      }
    } else {
      // Handle generic Axios errors (network issues, etc.)
      const status = axiosError.response?.status
      if (status === 401) {
        toast.error("Unauthorized! Please log in.")
      } else if (status === 403) {
        toast.error("Access denied.")
      } else if (status === 404) {
        toast.error("Resource not found.")
      } else if (status && status >= 500) {
        toast.error("Server error. Please try again later.")
      } else {
        toast.error(axiosError.message || "Something went wrong.")
      }
    }
  } else {
    console.error("Non-Axios error:", error)
    toast.error("An unknown error occurred.")
  }

  // Always re-throw to allow component-level handling if needed
  throw error
}
