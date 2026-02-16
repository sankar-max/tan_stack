
export type ApiSuccess<T> = {
  success: true
  status: number
  message: string
  data: T
}

export type ApiFailure = {
  success: false
  status: number
  message: string
  code: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiFailure
