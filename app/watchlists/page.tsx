import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Film, Lock, Globe, Users, MoreHorizontal, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import WatchlistClient from "./WatchlistClient" // ⬅️ Este es el nuevo import dinámico

export default function WatchlistsPage() {
  // Datos mock solo para pestaña "followed"
  const followedLists = [
    {
      id: "list4",
      title: "Joyas del cine independiente",
      description: "Películas indie que deberías conocer",
      movieCount: 32,
      user: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      coverImage: "/placeholder.svg?height=300&width=600&text=Indie",
      updatedAt: "Actualizada hace 3 días",
    },
    {
      id: "list5",
      title: "Ciencia ficción imprescindible",
      description: "Las mejores películas de ciencia ficción de todos los tiempos",
      movieCount: 45,
      user: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
      coverImage: "/placeholder.svg?height=300&width=600&text=Sci-Fi",
      updatedAt: "Actualizada hace 5 días",
    },
  ]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mis listas</h1>
          <p className="text-gray-400">Organiza tus películas en listas personalizadas</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar listas..." className="pl-8 w-[200px] md:w-[250px]" />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nueva lista
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-lists" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-8">
          <TabsTrigger value="my-lists">Mis listas</TabsTrigger>
          <TabsTrigger value="followed">Listas seguidas</TabsTrigger>
        </TabsList>

        <TabsContent value="my-lists">
          <WatchlistClient />
        </TabsContent>

        <TabsContent value="followed">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {followedLists.map((list) => (
              <div key={list.id} className="rounded-lg border border-gray-800 overflow-hidden group">
                <Link href={`/watchlists/${list.id}`} className="block">
                  <div className="h-40 relative">
                    <Image
                      src={list.coverImage || "/placeholder.svg"}
                      alt={list.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                  </div>
                </Link>

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/watchlists/${list.id}`} className="block">
                        <h3 className="font-medium text-lg hover:text-primary transition-colors">{list.title}</h3>
                      </Link>
                      <p className="text-sm text-gray-400 mt-1">{list.description}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Dejar de seguir</DropdownMenuItem>
                        <DropdownMenuItem>Compartir</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center mt-3">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={list.user.avatar} alt={list.user.name} />
                      <AvatarFallback>{list.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <Link href={`/profile/${list.user.id}`} className="text-sm hover:underline">
                      {list.user.name}
                    </Link>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                    <div className="flex items-center">
                      <Film className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm text-gray-400">{list.movieCount} películas</span>
                    </div>
                    <span className="text-xs text-gray-500">{list.updatedAt}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Card para descubrir listas */}
            <div className="rounded-lg border border-dashed border-gray-700 flex flex-col items-center justify-center p-8 h-full min-h-[250px]">
              <div className="bg-gray-800 rounded-full p-3 mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-lg mb-2">Descubrir listas</h3>
              <p className="text-sm text-gray-400 text-center mb-4">
                Encuentra listas interesantes creadas por otros usuarios
              </p>
              <Button asChild>
                <Link href="/discover/lists">Explorar listas</Link>
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
