// app/watchlists/[id]/WatchlistDetail.tsx
"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

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

import Image from "next/image"
import Link from "next/link"

export function WatchlistDetail({ watchlist }: { watchlist: any }) {
  const router = useRouter()
  return (
    <div>
      {/* Hero */}
      <div className="relative h-[30vh] md:h-[40vh]">
        <div className="absolute inset-0">
          <Image
            src={watchlist.cover_url || "/placeholder.svg"}
            alt={watchlist.name}
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
                <h1 className="text-3xl md:text-4xl font-bold mr-3">{watchlist.name}</h1>
                {watchlist.is_public ? (
                  <Badge variant="outline" className="flex items-center">
                    <Globe className="h-3 w-3 mr-1" />
                    Pública
                  </Badge>
                ) : (
                  <Badge variant="outline" className="flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    Privada
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/watchlists/${watchlist.id}/edit`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Link>
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
                    <DropdownMenuItem
                      onClick={async () => {
                        try {
                          const res = await fetch(`/api/watchlists/${watchlist.id}/duplicate`, {
                            method: "POST",
                          })
                          const data = await res.json()
                          if (res.ok && data.id) {
                            router.push(`/watchlists/${data.id}`)
                          } else {
                            alert("❌ Error al duplicar la lista: " + (data.error || "Desconocido"))
                          }
                        } catch (err) {
                          console.error("Error duplicando lista:", err)
                          alert("❌ Error inesperado al duplicar la lista.")
                        }
                      }}
                    >
                      Duplicar lista
                    </DropdownMenuItem>
                    <DropdownMenuItem>Exportar</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={async () => {
                        const confirmed = window.confirm("¿Estás segura de que quieres eliminar esta lista?")
                        if (!confirmed) return

                        const res = await fetch(`/api/watchlists/${watchlist.id}`, {
                          method: "DELETE"
                        })
                        if (res.ok) {
                          alert("Lista eliminada con éxito")
                          window.location.href = "/watchlists"
                        } else {
                          const err = await res.json()
                          alert(`Error al eliminar: ${err.error}`)
                        }
                      }}
                    >
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
                  <AvatarImage src={watchlist.user?.avatar || ""} alt={watchlist.user?.name || ""} />
                  <AvatarFallback>
                    {watchlist.user?.name?.substring(0, 2).toUpperCase() || "US"}
                  </AvatarFallback>
                </Avatar>
                <span>Creada por {watchlist.user?.name || "Usuario"}</span>
              </div>
              <span>•</span>
              <span>{new Date(watchlist.created_at).toLocaleDateString("es-ES")}</span>
              <span>•</span>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                <span>0 seguidores</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="container py-8 px-4 md:px-6">
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

        <div className="space-y-4">
          {watchlist.movies.length === 0 ? (
            <p className="text-gray-400">No hay películas en esta lista aún.</p>
          ) : (
            watchlist.movies.map(({ movie, added_at }: any) => (
              <div
                key={movie.id}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-lg border border-gray-800 bg-card"
              >
                <div className="w-full sm:w-auto flex items-center gap-4">
                  <div className="w-16 h-24 relative flex-shrink-0">
                    <Image
                      src={movie.image_url || "/placeholder.svg"}
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
                      <span>{movie.release_year}</span>
                      <span>•</span>
                      <span>{movie.director}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm">{movie.rating || 0}/5</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto mt-4 sm:mt-0">
                  <span className="text-xs text-gray-500">
                    Añadida el {new Date(added_at).toLocaleDateString("es-ES")}
                  </span>
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
            ))
          )}
        </div>
      </div>
    </div>
  )
}
