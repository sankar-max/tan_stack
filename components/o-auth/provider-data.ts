import { Github } from "lucide-react"

export const OAuthProviders = [
  {
    Icon: Github,
    provider: "github",
    label: "Github",
  },
]


export type OAuthProviderT = typeof OAuthProviders[number]