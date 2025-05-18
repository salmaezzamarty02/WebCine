import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus, MessageSquare, Settings, Film, Star, Calendar, MapPin, List, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import MovieCard from "@/components/movie-card"
import UserCard from "@/components/user-card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ProfilePage({ params }: { params: { id: string } }) {
  // Mock data for a user profile
  const profile = {
    id: params.id,
    name: "Ana García",
    username: "anagarcia",
    bio: "Cinéfila apasionada | Crítica de cine amateur | Amante del cine independiente y de autor",
    avatar: "/placeholder.svg?height=150&width=150&text=AG",
    coverImage: "/placeholder.svg?height=400&width=1200&text=Cover",
    location: "Madrid, España",
    memberSince: "Enero 2022",
    stats: {
      moviesWatched: 428,
      reviews: 156,
      lists: 12,
      followers: 245,
      following: 183,
    },
    recentActivity: [
      {
        id: "activity1",
        type: "review",
        movie: {
          id: "movie1",
          title: "Dune: Parte Dos",
          year: "2024",
          poster: "/placeholder.svg?height=300&width=200&text=Dune",
        },
        rating: 4.5,
        content:
          "Una secuela épica que supera a la primera parte. La cinematografía es impresionante y las actuaciones son soberbias.",
        date: "15 marzo, 2024",
      },
      {
        id: "activity2",
        type: "watched",
        movie: {
          id: "movie2",
          title: "Oppenheimer",
          year: "2023",
          poster: "/placeholder.svg?height=300&width=200&text=Oppenheimer",
        },
        date: "10 marzo, 2024",
      },
      {
        id: "activity3",
        type: "list",
        list: {
          id: "list1",
          title: "Mejores películas de 2023",
        },
        movies: [
          {
            id: "movie3",
            title: "Oppenheimer",
            year: "2023",
            poster: "/placeholder.svg?height=300&width=200&text=Oppenheimer",
          },
          {
            id: "movie4",
            title: "Barbie",
            year: "2023",
            poster: "/placeholder.svg?height=300&width=200&text=Barbie",
          },
          {
            id: "movie5",
            title: "Pobres criaturas",
            year: "2023",
            poster: "/placeholder.svg?height=300&width=200&text=Poor+Things",
          },
        ],
        date: "5 marzo, 2024",
      },
    ],
    favoriteMovies: [
      {
        id: "movie6",
        title: "El padrino",
        year: "1972",
        poster: "/placeholder.svg?height=300&width=200&text=Godfather",
        rating: 5.0,
      },
      {
        id: "movie7",
        title: "Parásitos",
        year: "2019",
        poster: "/placeholder.svg?height=300&width=200&text=Parasite",
        rating: 4.8,
      },
      {
        id: "movie8",
        title: "El club de la lucha",
        year: "1999",
        poster: "/placeholder.svg?height=300&width=200&text=Fight+Club",
        rating: 4.7,
      },
      {
        id: "movie9",
        title: "Pulp Fiction",
        year: "1994",
        poster: "/placeholder.svg?height=300&width=200&text=Pulp+Fiction",
        rating: 4.9,
      },
    ],
    watchlists: [
      {
        id: "list2",
        title: "Pendientes 2024",
        movieCount: 18,
        coverImage: "/placeholder.svg?height=200&width=400&text=Watchlist",
      },
      {
        id: "list3",
        title: "Clásicos por ver",
        movieCount: 24,
        coverImage: "/placeholder.svg?height=200&width=400&text=Classics",
      },
      {
        id: "list4",
        title: "Directores favoritos",
        movieCount: 32,
        coverImage: "/placeholder.svg?height=200&width=400&text=Directors",
      },
    ],
    friends: [
      {
        id: "user1",
        name: "Carlos Rodríguez",
        username: "carlosrodriguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
        moviesWatched: 312,
        isFollowing: true,
      },
      {
        id: "user2",
        name: "Laura Martínez",
        username: "lauramartinez",
        avatar: "/placeholder.svg?height=40&width=40&text=LM",
        moviesWatched: 245,
        isFollowing: true,
      },
      {
        id: "user3",
        name: "Miguel Sánchez",
        username: "miguelsanchez",
        avatar: "/placeholder.svg?height=40&width=40&text=MS",
        moviesWatched: 189,
        isFollowing: false,
      },
      {
        id: "user4",
        name: "Elena Gómez",
        username: "elenagomez",
        avatar: "/placeholder.svg?height=40&width=40&text=EG",
        moviesWatched: 276,
        isFollowing: true,
      },
    ],
  }

  const isOwnProfile = true // In a real app, this would be determined by comparing the logged-in user ID with the profile ID

  return (
    <div>
      {/* Profile Header */}
      <div className="relative">
        <div className="h-48 md:h-64 relative">
          <Image src={profile.coverImage || "/placeholder.svg"} alt="Cover" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 md:-mt-20">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback>{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-400">@{profile.username}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {isOwnProfile ? (
                <>
                  <Button asChild variant="outline">
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Editar perfil
                    </Link>
                  </Button>
                </>
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

              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Miembro desde {profile.memberSince}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8 text-center">
            <div className="rounded-lg border border-gray-800 p-3">
              <div className="text-2xl font-bold">{profile.stats.moviesWatched}</div>
              <div className="text-sm text-gray-400">Películas</div>
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

      {/* Profile Content */}
      <div className="container py-8 px-4 md:px-6">
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="movies">Películas</TabsTrigger>
            <TabsTrigger value="lists">Listas</TabsTrigger>
            <TabsTrigger value="friends">Amigos</TabsTrigger>
          </TabsList>

          <TabsContent value="activity">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-4">Actividad reciente</h2>

              {profile.recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-lg border border-gray-800 p-4">
                  {activity.type === "review" && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Film className="h-5 w-5 text-primary" />
                        <span className="font-medium">Reseña de película</span>
                        <span className="text-sm text-gray-500">{activity.date}</span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-16 h-24 relative flex-shrink-0">
                          <Image
                            src={activity.movie.poster || "/placeholder.svg"}
                            alt={activity.movie.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        <div>
                          <Link href={`/movie/${activity.movie.id}`} className="font-medium text-lg hover:underline">
                            {activity.movie.title}
                          </Link>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(activity.rating)
                                        ? "text-yellow-400 fill-current"
                                        : i < activity.rating
                                          ? "text-yellow-400 fill-current opacity-50"
                                          : "text-gray-600"
                                    }`}
                                  />
                                ))}
                            </div>
                            <span className="ml-2 text-sm">{activity.rating}/5</span>
                          </div>
                          <p className="text-sm text-gray-300 mt-2">{activity.content}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activity.type === "watched" && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="h-5 w-5 text-primary" />
                        <span className="font-medium">Película vista</span>
                        <span className="text-sm text-gray-500">{activity.date}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-16 h-24 relative flex-shrink-0">
                          <Image
                            src={activity.movie.poster || "/placeholder.svg"}
                            alt={activity.movie.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>

                        <div>
                          <Link href={`/movie/${activity.movie.id}`} className="font-medium text-lg hover:underline">
                            {activity.movie.title}
                          </Link>
                          <p className="text-sm text-gray-400">{activity.movie.year}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activity.type === "list" && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <List className="h-5 w-5 text-primary" />
                        <span className="font-medium">Lista creada</span>
                        <span className="text-sm text-gray-500">{activity.date}</span>
                      </div>

                      <Link
                        href={`/watchlists/${activity.list.id}`}
                        className="font-medium text-lg hover:underline mb-3 block"
                      >
                        {activity.list.title}
                      </Link>

                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {activity.movies.map((movie) => (
                          <div key={movie.id} className="w-20 flex-shrink-0">
                            <div className="w-20 h-30 relative mb-1">
                              <Image
                                src={movie.poster || "/placeholder.svg"}
                                alt={movie.title}
                                fill
                                className="object-cover rounded-md"
                              />
                            </div>
                            <p className="text-xs truncate">{movie.title}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="movies">
            <div className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Películas favoritas</h2>
                  <Link href={`/profile/${profile.id}/favorites`} className="text-sm text-primary hover:underline">
                    Ver todas
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {profile.favoriteMovies.map((movie) => (
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
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Vistas recientemente</h2>
                  <Link href={`/profile/${profile.id}/watched`} className="text-sm text-primary hover:underline">
                    Ver todas
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {profile.recentActivity
                    .filter((activity) => activity.type === "watched" || activity.type === "review")
                    .map((activity) => (
                      <MovieCard
                        key={activity.id}
                        id={activity.movie.id}
                        title={activity.movie.title}
                        year={activity.movie.year}
                        poster={activity.movie.poster}
                        rating={activity.type === "review" ? activity.rating : undefined}
                      />
                    ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="lists">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Listas</h2>
                <Link href={`/profile/${profile.id}/lists`} className="text-sm text-primary hover:underline">
                  Ver todas
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {profile.watchlists.map((list) => (
                  <Link
                    key={list.id}
                    href={`/watchlists/${list.id}`}
                    className="rounded-lg border border-gray-800 overflow-hidden group"
                  >
                    <div className="h-40 relative">
                      <Image
                        src={list.coverImage || "/placeholder.svg"}
                        alt={list.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-lg">{list.title}</h3>

                      <div className="flex items-center mt-2 text-sm text-gray-400">
                        <Film className="h-4 w-4 mr-1" />
                        <span>{list.movieCount} películas</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="friends">
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Amigos</h2>
                <Link href={`/profile/${profile.id}/friends`} className="text-sm text-primary hover:underline">
                  Ver todos
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.friends.map((friend) => (
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

import { Eye } from "lucide-react"
