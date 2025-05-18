import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Edit,
  Share,
  MoreHorizontal,
  Globe,
  Lock,
  Users,
  Plus,
  Star,
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function WatchlistDetailPage({ params }: { params: { id: string } }) {
  // Mock data for a watchlist
  const watchlist = {
    id: params.id,
    title: "Películas por ver",
    description:
      "Mi lista de pendientes para este año. Una mezcla de clásicos y estrenos que quiero ver cuando tenga tiempo.",
    privacy: "private",
    createdAt: "15 enero, 2024",
    updatedAt: "Actualizada hace 2 días",
    user: {
      id: "user1",
      name: "Ana García",
      avatar: "/placeholder.svg?height=40&width=40&text=AG",
    },
    coverImage: "/placeholder.svg?height=600&width=1200&text=Watchlist",
    followers: 24,
    movies: [
      {
        id: "movie1",
        title: "Dune: Parte Dos",
        year: "2024",
        director: "Denis Villeneuve",
        poster: "/placeholder.svg?height=300&width=200&text=Dune",
        rating: 4.5,
        addedAt: "15 marzo, 2024",
      },
      {
        id: "movie2",
        title: "Oppenheimer",
        year: "2023",
        director: "Christopher Nolan",
        poster: "/placeholder.svg?height=300&width=200&text=Oppenheimer",
        rating: 4.7,
        addedAt: "10 marzo, 2024",
      },
      {
        id: "movie3",
        title: "Pobres criaturas",
        year: "2023",
        director: "Yorgos Lanthimos",
        poster: "/placeholder.svg?height=300&width=200&text=Poor+Things",
        rating: 4.3,
        addedAt: "5 marzo, 2024",
      },
      {
        id: "movie4",
        title: "Anatomía de una caída",
        year: "2023",
        director: "Justine Triet",
        poster: "/placeholder.svg?height=300&width=200&text=Anatomy",
        rating: 4.4,
        addedAt: "1 marzo, 2024",
      },
      {
        id: "movie5",
        title: "La zona de interés",
        year: "2023",
        director: "Jonathan Glazer",
        poster: "/placeholder.svg?height=300&width=200&text=Zone",
        rating: 4.2,
        addedAt: "25 febrero, 2024",
      },
    ],
  }

  return (
    <div>
      {/* Watchlist Hero */}
      <div className="relative h-[30vh] md:h-[40vh]">
        <div className="absolute inset-0">
          <Image
            src={watchlist.coverImage || "/placeholder.svg"}
            alt={watchlist.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        </div>

        <div className="container relative h-full flex items-end pb-8 px-4 md:px-6">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <h1 className="text-3xl md:text-4xl font-bold mr-3">{watchlist.title}</h1>
                {watchlist.privacy === "private" ? (
                  <Badge variant="outline" className="flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Privada
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center">
                    <Globe className="h-3 w-3 mr-1" />
                    Pública
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="h-4 w-4 mr-1" />
                  Compartir
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Duplicar lista</DropdownMenuItem>
                    <DropdownMenuItem>Exportar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar lista
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <p className="text-gray-300 mb-4 max-w-3xl">{watchlist.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={watchlist.user.avatar} alt={watchlist.user.name} />
                  <AvatarFallback>{watchlist.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>Creada por {watchlist.user.name}</span>
              </div>
              <span>•</span>
              <span>{watchlist.createdAt}</span>
              <span>•</span>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>{watchlist.followers} seguidores</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Watchlist Content */}
      <div className="container py-8 px-4 md:px-6">
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar en esta lista..." className="pl-8 w-[200px] md:w-[250px]" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Filtrar
            </Button>
            <Button variant="outline" size="sm">
              <ArrowUpDown className="h-4 w-4 mr-1" />
              Ordenar
            </Button>
          </div>

          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Añadir películas
          </Button>
        </div>

        {/* Movies List */}
        <div className="space-y-4">
          {watchlist.movies.map((movie) => (
            <div
              key={movie.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-800 bg-card"
            >
              <div className="w-full sm:w-auto flex items-center gap-4">
                <div className="w-16 h-24 relative flex-shrink-0">
                  <Image
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>

                <div className="flex-1">
                  <Link href={`/movie/${movie.id}`} className="font-medium text-lg hover:underline">
                    {movie.title}
                  </Link>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mt-1">
                    <span>{movie.year}</span>
                    <span>•</span>
                    <span>{movie.director}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="text-sm">{movie.rating}/5</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-auto mt-4 sm:mt-0">
                <span className="text-xs text-gray-500">Añadida: {movie.addedAt}</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Mover a otra lista</DropdownMenuItem>
                    <DropdownMenuItem>Marcar como vista</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-500">Eliminar de la lista</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
