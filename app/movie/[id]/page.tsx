import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, Plus, Heart, MessageSquare, Share, Bookmark, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import MovieCard from "@/components/movie-card"

export default function MoviePage({ params }: { params: { id: string } }) {
  // Mock data for a movie
  const movie = {
    id: params.id,
    title: "Dune: Parte Dos",
    originalTitle: "Dune: Part Two",
    year: "2024",
    duration: "166 min",
    genres: ["Ciencia ficción", "Aventura", "Drama"],
    director: "Denis Villeneuve",
    cast: [
      { id: "actor1", name: "Timothée Chalamet", character: "Paul Atreides" },
      { id: "actor2", name: "Zendaya", character: "Chani" },
      { id: "actor3", name: "Rebecca Ferguson", character: "Lady Jessica" },
      { id: "actor4", name: "Javier Bardem", character: "Stilgar" },
      { id: "actor5", name: "Josh Brolin", character: "Gurney Halleck" },
    ],
    synopsis:
      "Paul Atreides se une a Chani y los Fremen mientras busca venganza contra los conspiradores que destruyeron a su familia. Enfrentando una elección entre el amor de su vida y el destino del universo conocido, debe evitar un futuro terrible que solo él puede prever.",
    poster: "/placeholder.svg?height=600&width=400&text=Dune",
    backdrop: "/placeholder.svg?height=1080&width=1920&text=Dune+Backdrop",
    rating: 4.5,
    userRating: null,
    reviews: [
      {
        id: "review1",
        user: {
          id: "user1",
          name: "Ana García",
          avatar: "/placeholder.svg?height=40&width=40&text=AG",
        },
        rating: 5,
        content:
          "Una secuela épica que supera a la primera parte. La cinematografía es impresionante y las actuaciones son soberbias. Denis Villeneuve ha creado una obra maestra visual que respeta el material original.",
        date: "15 marzo, 2024",
        likes: 42,
        comments: 8,
      },
      {
        id: "review2",
        user: {
          id: "user2",
          name: "Carlos Rodríguez",
          avatar: "/placeholder.svg?height=40&width=40&text=CR",
        },
        rating: 4,
        content:
          "Excelente continuación que profundiza en los personajes y expande el universo de Dune. Las escenas de acción son espectaculares y la banda sonora de Hans Zimmer complementa perfectamente la narrativa.",
        date: "10 marzo, 2024",
        likes: 28,
        comments: 5,
      },
    ],
    similar: [
      {
        id: "movie1",
        title: "Blade Runner 2049",
        year: "2017",
        poster: "/placeholder.svg?height=300&width=200&text=Blade+Runner",
        rating: 4.3,
      },
      {
        id: "movie2",
        title: "Arrival",
        year: "2016",
        poster: "/placeholder.svg?height=300&width=200&text=Arrival",
        rating: 4.2,
      },
      {
        id: "movie3",
        title: "Interstellar",
        year: "2014",
        poster: "/placeholder.svg?height=300&width=200&text=Interstellar",
        rating: 4.6,
      },
      {
        id: "movie4",
        title: "Foundation",
        year: "2021",
        poster: "/placeholder.svg?height=300&width=200&text=Foundation",
        rating: 4.0,
      },
    ],
  }

  return (
    <div>
      {/* Movie Hero */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0">
          <Image src={movie.backdrop || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="container relative h-full flex items-end pb-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-32 md:w-48 h-48 md:h-72 relative mt-8 md:mt-0 rounded-lg overflow-hidden shadow-lg">
              <Image src={movie.poster || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
              {movie.originalTitle !== movie.title && <p className="text-gray-400 mb-2">{movie.originalTitle}</p>}

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span>{movie.year}</span>
                <span>•</span>
                <span>{movie.duration}</span>
                <span>•</span>
                <div className="flex gap-2">
                  {movie.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{movie.rating}</span>
                  <span className="text-gray-400 ml-1">/5</span>
                </div>

                <div className="h-4 border-l border-gray-600"></div>

                <div className="text-sm text-gray-400">{movie.reviews.length} reseñas</div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button>
                  <Eye className="mr-2 h-4 w-4" />
                  Marcar como vista
                </Button>
                <Button variant="outline">
                  <Star className="mr-2 h-4 w-4" />
                  Valorar
                </Button>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir a lista
                </Button>
                <Button variant="ghost" size="icon">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Content */}
      <div className="container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
                <TabsTrigger value="where">Dónde ver</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-8">
                {/* Synopsis */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Sinopsis</h2>
                  <p className="text-gray-300">{movie.synopsis}</p>
                </div>

                {/* Cast */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Reparto</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.cast.map((actor) => (
                      <div key={actor.id} className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={`/placeholder.svg?height=48&width=48&text=${actor.name.substring(0, 2)}`}
                            alt={actor.name}
                          />
                          <AvatarFallback>{actor.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{actor.name}</p>
                          <p className="text-sm text-gray-400">{actor.character}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Crew */}
                <div>
                  <h2 className="text-2xl font-bold mb-4">Equipo</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-medium">Director</p>
                      <p className="text-gray-400">{movie.director}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-6">
                {/* Write Review */}
                <div className="rounded-lg border border-gray-800 p-4">
                  <h3 className="font-medium mb-3">Escribe tu reseña</h3>
                  <div className="flex items-center mb-3">
                    <p className="mr-2">Tu valoración:</p>
                    <div className="flex">
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <Star
                            key={i}
                            className={
                              `h-5 w-5 cursor-pointer ${\
                            i &lt; (movie.userRating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-600"
                          }`
                            }
                          />
                        ))}
                    </div>
                  </div>
                  <Textarea placeholder="Comparte tu opinión sobre esta película..." className="mb-3" />
                  <Button>Publicar reseña</Button>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                  {movie.reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-gray-800 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={review.user.avatar} alt={review.user.name} />
                            <AvatarFallback>{review.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              <Link href={`/profile/${review.user.id}`} className="hover:underline">
                                {review.user.name}
                              </Link>
                            </div>
                            <p className="text-xs text-gray-500">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={
                                  `h-4 w-4 ${
                                i &lt; review.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-600"
                              }`
                                }
                              />
                            ))}
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4">{review.content}</p>

                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                          <Heart className="h-4 w-4 mr-1" />
                          <span>{review.likes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>{review.comments}</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="where">
                <div className="rounded-lg border border-gray-800 p-6 text-center">
                  <h3 className="text-xl font-medium mb-4">Disponible en plataformas de streaming</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {["Netflix", "HBO Max", "Amazon Prime", "Disney+"].map((platform) => (
                      <div key={platform} className="p-4 rounded-lg bg-gray-900 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-800 mb-2 flex items-center justify-center">
                          {platform.charAt(0)}
                        </div>
                        <span>{platform}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm">La disponibilidad puede variar según tu ubicación.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Similar Movies */}
            <div>
              <h2 className="text-xl font-bold mb-4">Películas similares</h2>
              <div className="grid grid-cols-2 gap-4">
                {movie.similar.map((similarMovie) => (
                  <MovieCard
                    key={similarMovie.id}
                    id={similarMovie.id}
                    title={similarMovie.title}
                    year={similarMovie.year}
                    poster={similarMovie.poster}
                    rating={similarMovie.rating}
                    compact
                  />
                ))}
              </div>
            </div>

            {/* Collections */}
            <div className="rounded-lg border border-gray-800 p-4">
              <h2 className="text-xl font-bold mb-4">Colecciones</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Saga Dune</span>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Seguir
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Películas de Denis Villeneuve</span>
                  <Button variant="ghost" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Seguir
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
