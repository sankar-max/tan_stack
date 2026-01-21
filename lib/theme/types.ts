export enum Theme {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

export interface ThemeConfig {
  id: Theme
  label: string
  icon?: string
}
