"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Heart, MessageSquare, MoreHorizontal, Filter, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MovieReviewsProps {
  movieId: string
  movieTitle: string
  reviews: {
    id: string
    user: {
      id: string
      name: string
      avatar: string
    }
    rating: number
    content: string
    date: string
    likes: number
    comments: number
  }[]
}

export default function MovieReviews({ movieId, movieTitle, reviews }: MovieReviewsProps) {
  const [userRating, setUserRating] = useState<number | null>(null)
  const [reviewContent, setReviewContent] = useState("")
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)
  const [sortBy, setSortBy] = useState("recent")
  const [filter, setFilter] = useState("all")

  const handleStarHover = (star: number) => {
    setHoveredStar(star)
  }

  const handleStarLeave = () => {
    setHoveredStar(null)
  }

  const handleStarClick = (star: number) => {
    setUserRating(star)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const handleFilterChange = (value: string) => {
    setFilter(value)
  }

  const handleSubmitReview = () => {
    console.log({
      movieId,
      rating: userRating,
      content: reviewContent,
    })
    // In a real app, this would send the review to the server
  }

  const handleLike = (reviewId: string) => {
    console.log("Like review:", reviewId)
    // In a real app, this would update the likes count
  }

  // Sort and filter reviews
  let filteredReviews = [...reviews]
  if (filter === "5-stars") {
    filteredReviews = filteredReviews.filter((review) => review.rating === 5)
  } else if (filter === "4-stars") {
    filteredReviews = filteredReviews.filter((review) => review.rating === 4)
  } else if (filter === "3-stars") {
    filteredReviews = filteredReviews.filter((review) => review.rating === 3)
  } else if (filter === "2-stars") {
    filteredReviews = filteredReviews.filter((review) => review.rating === 2)
  } else if (filter === "1-star") {
    filteredReviews = filteredReviews.filter((review) => review.rating === 1)
  }

  if (sortBy === "recent") {
    // Assume the dates are already in order, just a mock example
  } else if (sortBy === "likes") {
    filteredReviews.sort((a, b) => b.likes - a.likes)
  } else if (sortBy === "rating-high") {
    filteredReviews.sort((a, b) => b.rating - a.rating)
  } else if (sortBy === "rating-low") {
    filteredReviews.sort((a, b) => a.rating - b.rating)
  }

  return (
    <div className="space-y-6">
      {/* Write Review */}
      <div className="rounded-lg border border-gray-800 p-4">
        <h3 className="font-medium mb-3">Escribe tu reseña de {movieTitle}</h3>
        <div className="flex items-center mb-3">
          <p className="mr-2">Tu valoración:</p>
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 cursor-pointer ${
                    (hoveredStar !== null && i < hoveredStar) || (hoveredStar === null && i < (userRating || 0))
                      ? "text-yellow-400 fill-current"
                      : "text-gray-600"
                  }`}
                  onMouseEnter={() => handleStarHover(i + 1)}
                  onMouseLeave={handleStarLeave}
                  onClick={() => handleStarClick(i + 1)}
                />
              ))}
          </div>
          {userRating && <span className="ml-2 text-sm">{userRating}/5</span>}
        </div>
        <Textarea
          placeholder="Comparte tu opinión sobre esta película..."
          className="mb-3"
          value={reviewContent}
          onChange={(e) => setReviewContent(e.target.value)}
        />
        <Button onClick={handleSubmitReview} disabled={!userRating || !reviewContent.trim()}>
          Publicar reseña
        </Button>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="border-0 p-0 bg-transparent h-auto hover:bg-transparent">
                <SelectValue placeholder="Todas las reseñas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las reseñas</SelectItem>
                <SelectItem value="5-stars">5 estrellas</SelectItem>
                <SelectItem value="4-stars">4 estrellas</SelectItem>
                <SelectItem value="3-stars">3 estrellas</SelectItem>
                <SelectItem value="2-stars">2 estrellas</SelectItem>
                <SelectItem value="1-star">1 estrella</SelectItem>
              </SelectContent>
            </Select>
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-400">{filteredReviews.length} reseñas</p>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <ArrowUpDown className="h-4 w-4" />
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="border-0 p-0 bg-transparent h-auto hover:bg-transparent">
                <SelectValue placeholder="Más recientes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Más recientes</SelectItem>
                <SelectItem value="likes">Más populares</SelectItem>
                <SelectItem value="rating-high">Mayor puntuación</SelectItem>
                <SelectItem value="rating-low">Menor puntuación</SelectItem>
              </SelectContent>
            </Select>
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review.id} className="rounded-lg border border-gray-800 p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={review.user.avatar || "/placeholder.svg"} alt={review.user.name} />
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
                        className={`h-4 w-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                      />
                    ))}
                </div>
              </div>

              <p className="text-gray-300 mb-4">{review.content}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-primary"
                    onClick={() => handleLike(review.id)}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    <span>{review.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>{review.comments}</span>
                  </Button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Reportar</DropdownMenuItem>
                    <DropdownMenuItem>Copiar enlace</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400">No hay reseñas que coincidan con tu filtro.</p>
          </div>
        )}
      </div>
    </div>
  )
}
