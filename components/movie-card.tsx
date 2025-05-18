import Image from "next/image"
import Link from "next/link"
import { Star, Clock, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MovieCardProps {
  id: string
  title: string
  year: string
  poster: string
  rating?: number
  compact?: boolean
}

export default function MovieCard({ id, title, year, poster, rating, compact = false }: MovieCardProps) {
  return (
    <div className={`movie-card relative group ${compact ? "w-full" : "w-[180px]"}`}>
      <Link href={`/movie/${id}`}>
        <div className="relative overflow-hidden rounded-md aspect-[2/3]">
          <Image
            src={poster || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="ghost" size="sm" className="text-white">
              Ver detalles
            </Button>
          </div>
          {rating && (
            <div className="absolute top-2 right-2 bg-black/70 rounded-full p-1 flex items-center">
              <Star className="h-3 w-3 text-yellow-400 mr-0.5" />
              <span className="text-xs font-medium">{rating}</span>
            </div>
          )}
        </div>
      </Link>
      <div className="mt-2">
        <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-400">{year}</span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Clock className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
