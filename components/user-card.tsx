import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Film, UserPlus } from "lucide-react"
import Link from "next/link"

interface UserCardProps {
  id: string
  name: string
  username: string
  avatar?: string
  moviesWatched: number
  isFollowing?: boolean
}

export default function UserCard({ id, name, username, avatar, moviesWatched, isFollowing = false }: UserCardProps) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-card hover:bg-card/80 transition-colors">
      <Link href={`/profile/${id}`} className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={avatar || "/placeholder.svg?height=40&width=40"} alt={name} />
          <AvatarFallback>{name.substring(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-sm">{name}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>@{username}</span>
            <span className="flex items-center gap-1">
              <Film className="h-3 w-3" />
              {moviesWatched}
            </span>
          </div>
        </div>
      </Link>
      <Button variant={isFollowing ? "secondary" : "default"} size="sm">
        {isFollowing ? (
          "Siguiendo"
        ) : (
          <>
            <UserPlus className="h-3 w-3 mr-1" />
            Seguir
          </>
        )}
      </Button>
    </div>
  )
}
