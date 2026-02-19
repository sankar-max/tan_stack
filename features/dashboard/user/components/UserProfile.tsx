import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User } from "../types"
import { Mail, MapPin, Link as LinkIcon, Calendar } from "lucide-react"
import { format } from "date-fns"

interface UserProfileProps {
  user: User & {
    profile?: {
      bio?: string | null
      location?: string | null
      website?: string | null
      jobTitle?: string | null
      company?: string | null
    } | null
  }
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image || ""} alt={user.name || "User"} />
          <AvatarFallback>
            {user.name?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-3 w-3" />
            <span>{user.email}</span>
            {user.emailVerified && (
              <Badge variant="secondary" className="h-5 text-[10px]">
                Verified
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {user.profile?.bio && (
          <div>
            <h4 className="text-sm font-semibold mb-1">Bio</h4>
            <p className="text-sm text-muted-foreground">{user.profile.bio}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {user.profile?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{user.profile.location}</span>
            </div>
          )}
          {user.profile?.website && (
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4" />
              <a
                href={user.profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {user.profile.website.replace(/^https?:\/\//, "")}
              </a>
            </div>
          )}
          {user.profile?.company && (
            <div className="flex items-center gap-1">
              <span>
                {user.profile.jobTitle ? `${user.profile.jobTitle} at ` : ""}
                {user.profile.company}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {format(new Date(user.createdAt), "MMMM yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
