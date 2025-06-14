import { getMovieById } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Star, Plus, Heart, MessageSquare, Share, Bookmark, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import MovieCard from "@/components/movie-card"

export default async function MoviePage({ params }: { params: { id: string } }) {
  const movie = await getMovieById(params.id)

  if (!movie) {
    return <div className="p-6 text-center">Película no encontrada.</div>
  }

  const genres = movie.genre?.split(",") || []
  const cast = movie.cast || []

  return (
    <div>
      {/* Movie Hero */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <div className="absolute inset-0">
          <Image src={movie.backdrop_url || "/placeholder.svg"} alt={movie.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="container relative h-full flex items-end pb-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-32 md:w-48 h-48 md:h-72 relative mt-8 md:mt-0 rounded-lg overflow-hidden shadow-lg">
              <Image src={movie.image_url || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
            </div>

            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold mb-2">{movie.title}</h1>
              {movie.original_title && movie.original_title !== movie.title && (
                <p className="text-gray-400 mb-2">{movie.original_title}</p>
              )}

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span>{movie.release_year}</span>
                {movie.duration && <><span>•</span><span>{movie.duration}</span></>}
                {genres.length > 0 && (
                  <>
                    <span>•</span>
                    <div className="flex gap-2">
                      {genres.map((genre: string) => (
                        <Badge key={genre} variant="secondary">
                          {genre.trim()}
                        </Badge>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-medium">{movie.rating || "-"}</span>
                  <span className="text-gray-400 ml-1">/5</span>
                </div>
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
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="w-full grid grid-cols-2 md:grid-cols-3 mb-6">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="where">Dónde ver</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-8">
            {/* Synopsis */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Sinopsis</h2>
              <p className="text-gray-300">{movie.description || "Sin sinopsis disponible."}</p>
            </div>

            {/* Cast */}
            {cast.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Reparto</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {cast.map((actor: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/placeholder.svg?height=48&width=48&text=${actor.name.substring(0, 2)}`} alt={actor.name} />
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
            )}

            {/* Crew */}
            {movie.director && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Equipo</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="font-medium">Director</p>
                    <p className="text-gray-400">{movie.director}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="where">
            <div className="rounded-lg border border-gray-800 p-6 text-center">
              <h3 className="text-xl font-medium mb-4">Disponible en plataformas de streaming</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {['Netflix', 'HBO Max', 'Amazon Prime', 'Disney+'].map((platform) => (
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
    </div>
  )
}
