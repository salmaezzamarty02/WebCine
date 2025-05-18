import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, UserPlus, Users, Film, Check, X } from "lucide-react"
import Link from "next/link"
import UserCard from "@/components/user-card"

export default function FriendsPage() {
  // Mock data
  const friends = [
    {
      id: "user1",
      name: "Ana García",
      username: "anagarcia",
      avatar: "/placeholder.svg?height=40&width=40&text=AG",
      moviesWatched: 428,
      isFollowing: true,
    },
    {
      id: "user2",
      name: "Carlos Rodríguez",
      username: "carlosrodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=CR",
      moviesWatched: 312,
      isFollowing: true,
    },
    {
      id: "user3",
      name: "Laura Martínez",
      username: "lauramartinez",
      avatar: "/placeholder.svg?height=40&width=40&text=LM",
      moviesWatched: 245,
      isFollowing: true,
    },
    {
      id: "user4",
      name: "Miguel Sánchez",
      username: "miguelsanchez",
      avatar: "/placeholder.svg?height=40&width=40&text=MS",
      moviesWatched: 189,
      isFollowing: true,
    },
    {
      id: "user5",
      name: "Elena Gómez",
      username: "elenagomez",
      avatar: "/placeholder.svg?height=40&width=40&text=EG",
      moviesWatched: 276,
      isFollowing: true,
    },
  ]

  const suggestions = [
    {
      id: "user6",
      name: "Javier López",
      username: "javierlopez",
      avatar: "/placeholder.svg?height=40&width=40&text=JL",
      moviesWatched: 215,
      isFollowing: false,
      mutualFriends: 3,
    },
    {
      id: "user7",
      name: "María Fernández",
      username: "mariafernandez",
      avatar: "/placeholder.svg?height=40&width=40&text=MF",
      moviesWatched: 178,
      isFollowing: false,
      mutualFriends: 2,
    },
    {
      id: "user8",
      name: "Pablo Díaz",
      username: "pablodiaz",
      avatar: "/placeholder.svg?height=40&width=40&text=PD",
      moviesWatched: 302,
      isFollowing: false,
      mutualFriends: 1,
    },
  ]

  const requests = [
    {
      id: "user9",
      name: "Sofía Ruiz",
      username: "sofiaruiz",
      avatar: "/placeholder.svg?height=40&width=40&text=SR",
      moviesWatched: 156,
      isFollowing: false,
      requestDate: "Hace 2 días",
    },
    {
      id: "user10",
      name: "Daniel Torres",
      username: "danieltorres",
      avatar: "/placeholder.svg?height=40&width=40&text=DT",
      moviesWatched: 203,
      isFollowing: false,
      requestDate: "Hace 5 días",
    },
  ]

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
          <Button>
            <UserPlus className="mr-2 h-4 w-4" />
            Encontrar amigos
          </Button>
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
                  id={friend.id}
                  name={friend.name}
                  username={friend.username}
                  avatar={friend.avatar}
                  moviesWatched={friend.moviesWatched}
                  isFollowing={friend.isFollowing}
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
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4">Personas que quizás conozcas</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-800 bg-card hover:bg-card/80 transition-colors"
                  >
                    <Link href={`/profile/${user.id}`} className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
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
                    <Button size="sm">
                      <UserPlus className="h-3 w-3 mr-1" />
                      Seguir
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Encuentra amigos</h2>
              <div className="rounded-lg border border-gray-800 p-6">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Conecta con tus amigos</h3>
                  <p className="text-gray-400 mb-4">Encuentra a tus amigos que ya están en FilmSocial</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="h-auto py-3">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                    </svg>
                    Conectar con Facebook
                  </Button>

                  <Button variant="outline" className="h-auto py-3">
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Conectar con Google
                  </Button>
                </div>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-gray-400">O</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Label htmlFor="email-invite">Invitar por email</Label>
                    <div className="flex mt-1">
                      <Input id="email-invite" placeholder="email@ejemplo.com" className="rounded-r-none" />
                      <Button className="rounded-l-none">Invitar</Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="requests">
          {requests.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">Solicitudes pendientes</h2>
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-gray-800 bg-card"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={request.avatar || "/placeholder.svg"} alt={request.name} />
                      <AvatarFallback>{request.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <Link href={`/profile/${request.id}`} className="font-medium hover:underline">
                        {request.name}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>@{request.username}</span>
                        <span className="flex items-center gap-1">
                          <Film className="h-3 w-3" />
                          {request.moviesWatched}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Solicitud recibida {request.requestDate}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-600 text-green-500 hover:bg-green-900/20"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Aceptar
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-600 text-red-500 hover:bg-red-900/20">
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

import { Label } from "@/components/ui/label"
