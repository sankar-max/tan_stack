"use client"

import { useTheme as useNextTheme } from "next-themes"
import { Theme } from "@/lib/theme/types"

export function useTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme()

  return {
    theme: theme as Theme | undefined,
    setTheme: (t: Theme) => setTheme(t),
    resolvedTheme: resolvedTheme as Theme | undefined,
    systemTheme: systemTheme as Theme | undefined,
    isDark: resolvedTheme === Theme.DARK,
    isLight: resolvedTheme === Theme.LIGHT,
  }
}
