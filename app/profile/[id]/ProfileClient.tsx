//profile/id/ProfileClient.tsx
"use client"

import { useAuth } from "@/context/auth-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs"
import {
  Settings,
  UserPlus,
  MessageSquare,
  MoreHorizontal,
  MapPin,
  Calendar,
  Film,
  Star,
  List as ListIcon,
  Eye
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"
import MovieCard from "@/components/movie-card"
import UserCard from "@/components/user-card"

export default function ProfileClient({ profile }: { profile: any }) {
  const { profile: currentUser } = useAuth()
  const isOwnProfile = currentUser?.id === profile.id

  return (
    <div>
      {/* Header */}
      <div className="relative">
        <div className="h-48 md:h-64 relative">
          <Image
            src={profile.coverimage || "/placeholder.svg"}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 md:-mt-20">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback>
                {profile.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-400">@{profile.username}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {isOwnProfile ? (
                <Button asChild variant="outline">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Editar perfil
                  </Link>
                </Button>
              ) : (
                <>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Seguir
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Mensaje
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Bloquear usuario</DropdownMenuItem>
                      <DropdownMenuItem>Reportar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 mb-8">
            <p className="text-gray-200 mb-4">{profile.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.created_at && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Miembro desde {new Date(profile.created_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-center">
            <div className="rounded-lg border border-gray-800 p-3">
              <div className="text-2xl font-bold">{profile.stats.moviesWatched}</div>
              <div className="text-sm text-gray-400">Películas vistas</div>
            </div>
            <div className="rounded-lg border border-gray-800 p-3">
              <div className="text-2xl font-bold">{profile.stats.reviews}</div>
              <div className="text-sm text-gray-400">Reseñas</div>
            </div>
            <div className="rounded-lg border border-gray-800 p-3">
              <div className="text-2xl font-bold">{profile.stats.lists}</div>
              <div className="text-sm text-gray-400">Listas</div>
            </div>
            <div className="rounded-lg border border-gray-800 p-3">
              <div className="text-2xl font-bold">{profile.stats.followers}</div>
              <div className="text-sm text-gray-400">Seguidores</div>
            </div>
            <div className="rounded-lg border border-gray-800 p-3">
              <div className="text-2xl font-bold">{profile.stats.following}</div>
              <div className="text-sm text-gray-400">Siguiendo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="container py-8 px-4 md:px-6">
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="movies">Películas</TabsTrigger>
            <TabsTrigger value="lists">Listas</TabsTrigger>
            <TabsTrigger value="friends">Amigos</TabsTrigger>
          </TabsList>

          {/* ACTIVIDAD */}
          <TabsContent value="activity">
            {profile.recentActivity.length === 0 ? (
              <p className="text-gray-400">Sin actividad reciente.</p>
            ) : (
              <div className="space-y-4">
                {profile.recentActivity.map((activity: any) => (
                  <div key={activity.id} className="rounded-lg border border-gray-800 p-4">
                    {activity.type === "review" && (
                      <div className="flex items-start gap-4">
                        <Image
                          src={activity.movie.poster || "/placeholder.svg"}
                          alt={activity.movie.title}
                          width={80}
                          height={120}
                          className="rounded object-cover"
                        />
                        <div>
                          <Link href={`/movie/${activity.movie.id}`} className="font-semibold hover:underline">
                            {activity.movie.title}
                          </Link>
                          <p className="text-sm text-gray-400">{activity.content}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-sm">{activity.rating}/5</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                        </div>
                      </div>
                    )}
                    {activity.type === "watched" && (
                      <div className="flex items-start gap-4">
                        <Image
                          src={activity.movie.poster || "/placeholder.svg"}
                          alt={activity.movie.title}
                          width={80}
                          height={120}
                          className="rounded object-cover"
                        />
                        <div>
                          <Link href={`/movie/${activity.movie.id}`} className="font-semibold hover:underline">
                            {activity.movie.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">{activity.date}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* PELÍCULAS */}
          <TabsContent value="movies">
            {profile.favoriteMovies.length === 0 ? (
              <p className="text-gray-400">Sin películas favoritas.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {profile.favoriteMovies.map((movie: any) => (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    year={movie.year}
                    poster={movie.poster}
                    rating={movie.rating}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          {/* LISTAS */}
          <TabsContent value="lists">
            {profile.watchlists.length === 0 ? (
              <p className="text-gray-400">Sin listas creadas.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {profile.watchlists.map((list: any) => (
                  <Link
                    key={list.id}
                    href={`/watchlists/${list.id}`}
                    className="rounded-lg border border-gray-800 overflow-hidden group"
                  >
                    <div className="h-32 relative">
                      <Image
                        src={list.cover_url || "/placeholder.svg"}
                        alt={list.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold">{list.name}</h3>
                      <p className="text-xs text-gray-400">{new Date(list.created_at).toLocaleDateString()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>

          {/* AMIGOS */}
          <TabsContent value="friends">
            {profile.friends.length === 0 ? (
              <p className="text-gray-400">Sin amigos aún.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.friends.map((friend: any) => (
                  <UserCard
                    key={friend.id}
                    id={friend.id}
                    name={friend.name}
                    username={friend.username}
                    avatar={friend.avatar}
                    moviesWatched={friend.moviesWatched}
                    isFollowing={friend.isFollowing}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
