"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Star, Share, Bookmark, Eye, Heart, ThumbsDown, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import MovieCard from "@/components/movie-card"
import AddToListDialog from "@/components/add-to-list-dialog"

import {
  getMovieById,
  getReviewsByMovieId,
  getSimilarMovies,
  addReview,
  markMovieAsWatched,
  unmarkMovieAsWatched,
  isMovieWatchedByUser,
  incrementReviewLike,
  incrementReviewDislike,
  deleteReview
} from "@/lib/queries"

import { useAuth } from "@/context/auth-provider"

export default function MoviePage() {
  const { id } = useParams()
  const [movie, setMovie] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [similar, setSimilar] = useState<any[]>([])
  const [userRating, setUserRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isWatched, setIsWatched] = useState(false)
  const { profile } = useAuth()

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      const movieData = await getMovieById(id as string)
      const reviewData = await getReviewsByMovieId(id as string)
      const similarData = await getSimilarMovies(id as string)

      setMovie(movieData)
      setReviews(reviewData)
      setSimilar(similarData)

      if (profile?.id) {
        const watched = await isMovieWatchedByUser({
          userId: profile.id,
          movieId: movieData.id
        })
        setIsWatched(watched)
      }
    }

    fetchData()
  }, [id, profile?.id])

  const handleToggleWatched = async () => {
    if (!profile?.id) {
      alert("Debes iniciar sesión para marcar como vista")
      return
    }

    try {
      if (isWatched) {
        await unmarkMovieAsWatched({ userId: profile.id, movieId: movie.id })
        setIsWatched(false)
      } else {
        await markMovieAsWatched({ userId: profile.id, movieId: movie.id })
        setIsWatched(true)
      }
    } catch (err) {
      console.error("Error al actualizar estado de película:", err)
      alert("Error al actualizar estado de película")
    }
  }

  const handlePublishReview = async () => {
    if (!profile?.id) {
      alert("Debes iniciar sesión para publicar una reseña")
      return
    }

    if (!reviewText.trim() || userRating === 0) {
      alert("Completa tu reseña y valoración")
      return
    }

    try {
      await addReview({
        movie_id: movie.id,
        user_id: profile.id,
        rating: userRating,
        content: reviewText.trim(),
      })
      setUserRating(0)
      setReviewText("")
      const updatedReviews = await getReviewsByMovieId(movie.id)
      setReviews(updatedReviews)
      alert("Reseña publicada correctamente")
    } catch (err) {
      console.error("Error al publicar reseña:", err)
      alert("Error al publicar reseña")
    }
  }

  const handleLike = async (review: any) => {
    try {
      const updated = await incrementReviewLike(review.id, review.likes_count)
      setReviews(rs =>
        rs.map(r => (r.id === updated.id ? updated : r))
      )
    } catch (e) {
      alert("No se ha podido dar like")
    }
  }

  const handleDislike = async (review: any) => {
    try {
      const updated = await incrementReviewDislike(review.id, review.dislikes_count)
      setReviews(rs =>
        rs.map(r => (r.id === updated.id ? updated : r))
      )
    } catch (e) {
      alert("No se ha podido dar dislike")
    }
  }

  const handleDelete = async (review: any) => {
    if (!confirm("¿Seguro que quieres eliminar tu reseña?")) return
    try {
      await deleteReview(review.id)
      // quita del estado
      setReviews(rs => rs.filter(r => r.id !== review.id))
    } catch {
      alert("No se pudo eliminar la reseña")
    }
  }

  if (!movie) return <div className="p-6 text-center">Cargando...</div>

  return (
    <div>
      {/* HERO */}
      <div className="relative h-[50vh] md:h-[70vh]">
        <Image
          src={movie.backdrop_url || movie.image_url || "/placeholder.svg"}
          alt={movie.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      <div className="container relative h-full flex items-end pb-8 px-4 md:px-6 -mt-24 z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
          <div className="w-32 md:w-48 h-48 md:h-72 relative rounded-lg overflow-hidden shadow-lg">
            <Image src={movie.image_url || "/placeholder.svg"} alt={movie.title} fill className="object-cover" />
          </div>

          <div className="flex-1 text-white">
            <h1 className="text-3xl md:text-5xl font-bold">{movie.title}</h1>

            <div className="flex flex-wrap items-center gap-3 mt-2">
              {movie.release_year && <span>{movie.release_year}</span>}
              {movie.duration && <><span>•</span><span>{movie.duration}</span></>}
              {movie.genre && (
                <>
                  <span>•</span>
                  <Badge variant="secondary">{movie.genre}</Badge>
                </>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              {movie.rating && (
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-1" />
                  <span className="font-medium">{movie.rating}</span>
                  <span className="text-gray-400 ml-1">/5</span>
                </div>
              )}
              <div className="text-sm text-gray-400">{reviews.length} reseñas</div>
            </div>

            {/* BOTONES DE ACCIONES */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Button onClick={handleToggleWatched} variant={isWatched ? "secondary" : "default"}>
                <Eye className="mr-2 h-4 w-4" />
                {isWatched ? "Vista" : "Marcar como vista"}
              </Button>
              <Button variant="outline">
                <Star className="mr-2 h-4 w-4" /> Valorar
              </Button>
              <AddToListDialog
                movieId={movie.id}
                movieTitle={movie.title}
                moviePoster={movie.image_url || "/placeholder.svg"}
              />
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

      <div className="container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="info">
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="info">Información</TabsTrigger>
                <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              </TabsList>

              {/* INFO */}
              <TabsContent value="info" className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold mb-2">Sinopsis</h2>
                  <p className="text-gray-300">{movie.description || "Sin descripción disponible."}</p>
                </div>

                {movie.director && (
                  <div>
                    <h2 className="text-xl font-bold mb-2">Director</h2>
                    <p className="text-gray-300">{movie.director}</p>
                  </div>
                )}

                {movie.cast && movie.cast.length > 0 && (
                  <div>
                    <h2 className="text-xl font-bold mb-4">Reparto</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {movie.cast.map((actor: { name: string; character: string }, idx: number) => (
                        <div key={idx} className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            {/* usa iniciales si no tienes avatar */}
                            <AvatarFallback>
                              {actor.name
                                .split(" ")
                                .map(n => n[0])
                                .join("")
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-white">{actor.name}</p>
                            <p className="text-sm text-gray-400">como {actor.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* RESEÑAS */}
              <TabsContent value="reviews" className="space-y-6">
                <div className="rounded-lg border border-gray-800 p-4">
                  <h3 className="font-medium mb-3">Escribe tu reseña</h3>
                  <div className="flex items-center mb-3">
                    <p className="mr-2">Tu valoración:</p>
                    <div className="flex">
                      {Array(5).fill(0).map((_, i) => (
                        <Star
                          key={i}
                          onClick={() => setUserRating(i + 1)}
                          className={`h-5 w-5 cursor-pointer ${i < userRating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Comparte tu opinión sobre esta película..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="mb-3"
                  />
                  <Button onClick={handlePublishReview}>Publicar reseña</Button>
                </div>

                {reviews.length === 0 && <p className="text-gray-400">Aún no hay reseñas.</p>}
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="rounded-lg border border-gray-800 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>U</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              <Link href={`/profile/${review.user_id}`} className="hover:underline">
                                {review.profiles?.username || "Usuario"}
                              </Link>
                            </div>
                            <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300">{review.content}</p>
                      {/* Likes y Dislikes */}
                      <div className="flex items-center gap-4 mt-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Me gusta"
                          onClick={() => handleLike(review)}
                          className={`
    transition-colors
    ${review.likes_count > 0
                              ? "text-red-500 hover:text-red-600"
                              : "text-gray-400 hover:text-red-500"
                            }
  `}
                        >
                          <Heart className="h-5 w-5" />
                          <span className="ml-1 text-sm">{review.likes_count}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="No me gusta"
                          onClick={() => handleDislike(review)}
                          className={`
    transition-colors
    ${review.dislikes_count > 0
                              ? "text-blue-500 hover:text-blue-600"
                              : "text-gray-400 hover:text-blue-500"
                            }
  `}
                        >
                          <ThumbsDown className="h-5 w-5" />
                          <span className="ml-1 text-sm">{review.dislikes_count}</span>
                        </Button>
                        {profile?.id === review.user_id && (
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Eliminar reseña"
                            onClick={() => handleDelete(review)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash className="h-5 w-5" />
                          </Button>
                        )}

                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* SIMILARES */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Películas similares</h2>
            <div className="grid grid-cols-2 gap-4">
              {similar.map((m) => (
                <MovieCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  year={m.release_year?.toString() || ""}
                  poster={m.image_url}
                  rating={m.rating}
                  compact
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
