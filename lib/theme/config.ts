import { Theme, ThemeConfig } from "./types"

export const THEME_STORAGE_KEY = "app-theme"
export const DEFAULT_THEME = Theme.SYSTEM

export const THEMES: ThemeConfig[] = [
  {
    id: Theme.LIGHT,
    label: "Light",
  },
  {
    id: Theme.DARK,
    label: "Dark",
  },
  {
    id: Theme.SYSTEM,
    label: "System",
  },
]
