import { ApiResponse, ApiSuccess } from "@/lib/api/api-response"
import { apiInstance } from "./axios-instance"
import { handleApiError } from "./error-handler"
import { AxiosRequestConfig } from "axios"

/**
 * Standardized API client wrapper.
 * Provides type-safe methods for interacting with API routes.
 */
export async function axiosApi<T>(
  config: AxiosRequestConfig,
): Promise<ApiSuccess<T>> {
  try {
    const response = await apiInstance.request<ApiResponse<T>>(config)
    const result = response.data

    if (result.success) {
      return result
    } else {
      // This path is usually handled by Axios throwing on non-2xx statuses,
      // but we handle it here just in case our API returns 2xx with success: false.
      throw new Error(result.message || "Request failed")
    }
  } catch (error) {
    return handleApiError(error) as never
  }
}

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosApi<T>({ ...config, method: "GET", url }),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosApi<T>({ ...config, method: "POST", url, data }),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosApi<T>({ ...config, method: "PUT", url, data }),

  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosApi<T>({ ...config, method: "PATCH", url, data }),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    axiosApi<T>({ ...config, method: "DELETE", url }),
}
