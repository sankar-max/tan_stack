"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { THEME_STORAGE_KEY, DEFAULT_THEME } from "./config"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={DEFAULT_THEME}
      storageKey={THEME_STORAGE_KEY}
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}
