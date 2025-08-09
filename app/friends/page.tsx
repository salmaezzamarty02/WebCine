"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Users, Film, Check, X } from "lucide-react"
import Link from "next/link"
import UserCard from "@/components/user-card"
import useUser from "@/lib/useUser"
import {
  getFriends,
  getFriendSuggestions,
  getFriendRequests,
  sendFriendRequest,
  updateFriendRequest,
} from "@/lib/queries"

export interface UserSuggestion {
  id: string
  username: string
  name: string
  avatar: string | null
  moviesWatched: number
  mutualFriends: number
}

export interface FriendRequest {
  friendshipId: string   // id de la fila en friendships (para update/reject)
  userId: string         // id del solicitante (para perfil, avatar…)
  username: string
  name: string
  avatar: string | null
  moviesWatched: number
}

export default function FriendsPage() {
  const user = useUser()
  const [friends, setFriends] = useState<UserSuggestion[]>([])
  const [suggestions, setSuggestions] = useState<UserSuggestion[]>([])
  const [requests, setRequests] = useState<FriendRequest[]>([])

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      const [f, s, r] = await Promise.all([
        getFriends(user.id),
        getFriendSuggestions(user.id),
        getFriendRequests(user.id),
      ])
      setFriends(f)
      setSuggestions(s)
      setRequests(r)
    }

    fetchData()
  }, [user])

  const handleSendRequest = async (toId: string) => {
    if (!user) return
    await sendFriendRequest(user.id, toId)
    setSuggestions((prev: UserSuggestion[]) => prev.filter((u) => u.id !== toId))
  }

  const handleUpdateRequest = async (id: string, status: "accepted" | "rejected") => {
    await updateFriendRequest(id, status)
    setRequests((prev) => prev.filter((r) => r.friendshipId !== id))
    if (status === "accepted" && user) {
      const updated = await getFriends(user.id)
      setFriends(updated)
    }
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Amigos</h1>
          <p className="text-gray-400">Conecta con otros usuarios y descubre sus películas favoritas</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar usuarios..." className="pl-8 w-[200px] md:w-[250px]" />
          </div>
        </div>
      </div>

      <Tabs defaultValue="following" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-8">
          <TabsTrigger value="following">Siguiendo</TabsTrigger>
          <TabsTrigger value="suggestions">Sugerencias</TabsTrigger>
          <TabsTrigger value="requests">
            Solicitudes {requests.length > 0 && <Badge className="ml-2 bg-primary">{requests.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="following">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {friends.length > 0 ? (
              friends.map((friend) => (
                <UserCard
                  key={friend.id}
                  {...friend}
                  avatar={friend.avatar ?? undefined}
                  isFollowing={true}
                />
              ))
            ) : (
              <div className="col-span-2 text-center py-12">
                <Users className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Aún no sigues a nadie</h3>
                <p className="text-gray-400 mb-4">
                  Comienza a seguir a otros usuarios para ver su actividad y recomendaciones
                </p>
                <Button>Encontrar amigos</Button>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="suggestions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-card hover:bg-card/80 transition-colors"
              >
                <Link href={`/profile/${user.id}`} className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>
                      {(typeof user.name === "string" && user.name.length >= 2
                        ? user.name.substring(0, 2)
                        : "??").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-sm">{user.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span>@{user.username}</span>
                      <span className="flex items-center gap-1">
                        <Film className="h-3 w-3" />
                        {user.moviesWatched}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{user.mutualFriends} amigos en común</p>
                  </div>
                </Link>
                <Button size="sm" onClick={() => handleSendRequest(user.id)}>
                  <UserPlus className="h-3 w-3 mr-1" />
                  Seguir
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="requests">
          {requests.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Solicitudes pendientes</h2>
              {requests.map((request) => (
                <div
                  key={request.friendshipId}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                      <AvatarFallback>
                        {(typeof request.name === "string" && request.name.length >= 2
                          ? request.name.substring(0, 2)
                          : "??").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/profile/${request.friendshipId}`} className="font-medium hover:underline">
                        {request.name}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>@{request.username}</span>
                        <span className="flex items-center gap-1">
                          <Film className="h-3 w-3" />
                          {request.moviesWatched}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Solicitud recibida recientemente</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-600 text-green-500 hover:bg-green-900/20"
                      onClick={() => handleUpdateRequest(request.friendshipId, "accepted")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aceptar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-600 text-red-500 hover:bg-red-900/20"
                      onClick={() => handleUpdateRequest(request.friendshipId, "rejected")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Rechazar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <UserPlus className="h-12 w-12 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">No tienes solicitudes pendientes</h3>
              <p className="text-gray-400">Las solicitudes de amistad aparecerán aquí</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
