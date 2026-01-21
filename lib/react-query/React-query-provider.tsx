"use client"

import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { createQueryClient } from "@/lib/react-query/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

let browserQueryClient: QueryClient | undefined = undefined
function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always new (no sharing between requests)
    return createQueryClient()
  }

  // Client: singleton to survive re-renders / suspense
  if (!browserQueryClient) browserQueryClient = createQueryClient()
  return browserQueryClient
}
export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const queryClient = useState(() => getQueryClient())[0] // stable ref
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
