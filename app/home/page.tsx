import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Film, Star, MessageSquare, Heart, Bookmark, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  // Mock data
  const recentActivity = [
    {
      id: "1",
      type: "review",
      user: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      movie: {
        id: "movie1",
        title: "Dune: Parte Dos",
        year: "2024",
        poster: "/placeholder.svg?height=300&width=200&text=Dune",
      },
      rating: 4.5,
      content:
        "Una secuela épica que supera a la primera parte. La cinematografía es impresionante y las actuaciones son soberbias.",
      timestamp: "Hace 2 horas",
      likes: 24,
      comments: 8,
    },
    {
      id: "2",
      type: "watched",
      user: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
      movie: {
        id: "movie2",
        title: "Oppenheimer",
        year: "2023",
        poster: "/placeholder.svg?height=300&width=200&text=Oppenheimer",
      },
      timestamp: "Hace 5 horas",
    },
    {
      id: "3",
      type: "list",
      user: {
        id: "user3",
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40&text=LM",
      },
      list: {
        id: "list1",
        title: "Mejores thrillers psicológicos",
      },
      movies: [
        {
          id: "movie3",
          title: "El club de la lucha",
          year: "1999",
          poster: "/placeholder.svg?height=300&width=200&text=Fight+Club",
        },
        {
          id: "movie4",
          title: "Memento",
          year: "2000",
          poster: "/placeholder.svg?height=300&width=200&text=Memento",
        },
        {
          id: "movie5",
          title: "Shutter Island",
          year: "2010",
          poster: "/placeholder.svg?height=300&width=200&text=Shutter+Island",
        },
      ],
      timestamp: "Hace 1 día",
      likes: 42,
      comments: 15,
    },
  ]

  const trendingMovies = [
    {
      id: "movie1",
      title: "Dune: Parte Dos",
      year: "2024",
      poster: "/placeholder.svg?height=300&width=200&text=Dune",
      rating: 4.5,
    },
    {
      id: "movie6",
      title: "Pobres criaturas",
      year: "2023",
      poster: "/placeholder.svg?height=300&width=200&text=Poor+Things",
      rating: 4.3,
    },
    {
      id: "movie7",
      title: "Civil War",
      year: "2024",
      poster: "/placeholder.svg?height=300&width=200&text=Civil+War",
      rating: 4.1,
    },
    {
      id: "movie8",
      title: "Challengers",
      year: "2024",
      poster: "/placeholder.svg?height=300&width=200&text=Challengers",
      rating: 4.0,
    },
    {
      id: "movie9",
      title: "Godzilla x Kong",
      year: "2024",
      poster: "/placeholder.svg?height=300&width=200&text=Godzilla",
      rating: 3.8,
    },
  ]

  const recommendedMovies = [
    {
      id: "movie10",
      title: "Anatomía de una caída",
      year: "2023",
      poster: "/placeholder.svg?height=300&width=200&text=Anatomy",
      rating: 4.4,
    },
    {
      id: "movie11",
      title: "La zona de interés",
      year: "2023",
      poster: "/placeholder.svg?height=300&width=200&text=Zone",
      rating: 4.2,
    },
    {
      id: "movie12",
      title: "Vidas pasadas",
      year: "2023",
      poster: "/placeholder.svg?height=300&width=200&text=Past+Lives",
      rating: 4.5,
    },
    {
      id: "movie13",
      title: "Aftersun",
      year: "2022",
      poster: "/placeholder.svg?height=300&width=200&text=Aftersun",
      rating: 4.3,
    },
    {
      id: "movie14",
      title: "Todo a la vez en todas partes",
      year: "2022",
      poster: "/placeholder.svg?height=300&width=200&text=Everything",
      rating: 4.7,
    },
  ]

  const upcomingEvents = [
    {
      id: "event1",
      title: "Maratón de Ciencia Ficción",
      date: "15 de junio, 2024",
      time: "18:00 - 23:00",
      location: "Cine Doré, Madrid",
      attendees: 28,
      image: "/placeholder.svg?height=200&width=400&text=Sci-Fi+Marathon",
    },
    {
      id: "event2",
      title: "Debate: El cine de Almodóvar",
      date: "22 de junio, 2024",
      time: "19:30 - 21:00",
      location: "Online (Zoom)",
      attendees: 45,
      image: "/placeholder.svg?height=200&width=400&text=Almodovar",
    },
  ]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="feed">Para ti</TabsTrigger>
              <TabsTrigger value="friends">Amigos</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-6">
              {/* Activity Feed */}
              {recentActivity.map((activity) => (
                <div key={activity.id} className="rounded-lg border border-gray-800 bg-card overflow-hidden">
                  {/* Activity Header */}
                  <div className="p-4 flex items-start justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback>{activity.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          <Link href={`/profile/${activity.user.id}`} className="hover:underline">
                            {activity.user.name}
                          </Link>
                          {activity.type === "review" && <span className="text-gray-400"> reseñó una película</span>}
                          {activity.type === "watched" && <span className="text-gray-400"> vio una película</span>}
                          {activity.type === "list" && <span className="text-gray-400"> creó una lista</span>}
                        </div>
                        <p className="text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  </div>

                  {/* Activity Content */}
                  {activity.type === "review" && (
                    <div className="px-4 pb-4">
                      <div className="flex items-start mb-3">
                        <div className="w-16 h-24 relative mr-3 flex-shrink-0">
                          <Image
                            src={activity.movie.poster || "/placeholder.svg"}
                            alt={activity.movie.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <Link href={`/movie/${activity.movie.id}`} className="font-medium hover:underline">
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

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                        <div className="flex space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <Heart className="h-4 w-4 mr-1" />
                            <span>{activity.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{activity.comments}</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {activity.type === "watched" && (
                    <div className="px-4 pb-4">
                      <div className="flex items-center">
                        <div className="w-16 h-24 relative mr-3 flex-shrink-0">
                          <Image
                            src={activity.movie.poster || "/placeholder.svg"}
                            alt={activity.movie.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <Link href={`/movie/${activity.movie.id}`} className="font-medium hover:underline">
                            {activity.movie.title}
                          </Link>
                          <p className="text-sm text-gray-400">{activity.movie.year}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activity.type === "list" && (
                    <div className="px-4 pb-4">
                      <Link href={`/list/${activity.list.id}`} className="font-medium text-lg hover:underline">
                        {activity.list.title}
                      </Link>

                      <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
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

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                        <div className="flex space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <Heart className="h-4 w-4 mr-1" />
                            <span>{activity.likes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            <span>{activity.comments}</span>
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="friends">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Film className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Actividad de amigos</h3>
                <p className="text-gray-400 mb-4">Aquí verás la actividad reciente de tus amigos.</p>
                <Button asChild>
                  <Link href="/friends">Encontrar amigos</Link>
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="popular">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <TrendingUp className="h-12 w-12 text-gray-500 mb-4" />
                <h3 className="text-xl font-medium mb-2">Contenido popular</h3>
                <p className="text-gray-400 mb-4">Aquí verás las películas y reseñas más populares de la comunidad.</p>
                <Button asChild>
                  <Link href="/trending">Ver tendencias</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Trending Movies */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Tendencias</h2>
              <Link href="/trending" className="text-sm text-primary hover:underline">
                Ver más
              </Link>
            </div>
            <div className="space-y-4">
              {trendingMovies.slice(0, 3).map((movie) => (
                <div key={movie.id} className="flex items-center">
                  <div className="w-12 h-18 relative mr-3 flex-shrink-0">
                    <Image
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <Link href={`/movie/${movie.id}`} className="font-medium text-sm hover:underline line-clamp-1">
                      {movie.title}
                    </Link>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-400">{movie.rating}/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Movies */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recomendados</h2>
              <Link href="/recommendations" className="text-sm text-primary hover:underline">
                Ver más
              </Link>
            </div>
            <div className="space-y-4">
              {recommendedMovies.slice(0, 3).map((movie) => (
                <div key={movie.id} className="flex items-center">
                  <div className="w-12 h-18 relative mr-3 flex-shrink-0">
                    <Image
                      src={movie.poster || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <Link href={`/movie/${movie.id}`} className="font-medium text-sm hover:underline line-clamp-1">
                      {movie.title}
                    </Link>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-400">{movie.rating}/5</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Próximos eventos</h2>
              <Link href="/events" className="text-sm text-primary hover:underline">
                Ver más
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="rounded-lg border border-gray-800 overflow-hidden">
                  <div className="h-32 relative">
                    <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium">{event.title}</h3>
                    <div className="text-sm text-gray-400 mt-1">
                      <p>
                        {event.date} • {event.time}
                      </p>
                      <p>{event.location}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
                      <span className="text-xs text-gray-400">{event.attendees} asistentes</span>
                      <Button size="sm" variant="outline">
                        Asistir
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
