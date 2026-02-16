import { NextResponse } from "next/server"
import { ApiResponse } from "./api-response"

export function ok<T>(
  data: T,
  message = "Success",
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      status,
      message,
      data,
    },
    { status }
  )
}

export function fail(
  message: string,
  status = 400,
  code = "BAD_REQUEST",
  errors?: Record<string, string[]>
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      status,
      message,
      code,
      errors,
    },
    { status }
  )
}
