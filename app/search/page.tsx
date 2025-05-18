import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function SearchPage() {
  // Mock search results
  const movieResults = [
    {
      id: "movie1",
      title: "Dune: Parte Dos",
      year: 2024,
      director: "Denis Villeneuve",
      rating: 4.8,
      image: "/placeholder.svg?height=300&width=200&text=Dune",
      genres: ["Ciencia ficción", "Aventura"],
    },
    {
      id: "movie2",
      title: "Oppenheimer",
      year: 2023,
      director: "Christopher Nolan",
      rating: 4.7,
      image: "/placeholder.svg?height=300&width=200&text=Oppenheimer",
      genres: ["Drama", "Histórico"],
    },
    {
      id: "movie3",
      title: "Barbie",
      year: 2023,
      director: "Greta Gerwig",
      rating: 4.5,
      image: "/placeholder.svg?height=300&width=200&text=Barbie",
      genres: ["Comedia", "Fantasía"],
    },
    {
      id: "movie4",
      title: "Poor Things",
      year: 2023,
      director: "Yorgos Lanthimos",
      rating: 4.6,
      image: "/placeholder.svg?height=300&width=200&text=Poor+Things",
      genres: ["Drama", "Ciencia ficción"],
    },
  ]

  const userResults = [
    {
      id: "user1",
      name: "Ana García",
      username: "@anagarcia",
      avatar: "/placeholder.svg?height=40&width=40&text=AG",
      followers: 245,
      reviews: 78,
    },
    {
      id: "user2",
      name: "Carlos Rodríguez",
      username: "@carlosrodriguez",
      avatar: "/placeholder.svg?height=40&width=40&text=CR",
      followers: 189,
      reviews: 56,
    },
    {
      id: "user3",
      name: "Laura Martínez",
      username: "@lauramartinez",
      avatar: "/placeholder.svg?height=40&width=40&text=LM",
      followers: 312,
      reviews: 104,
    },
  ]

  const forumResults = [
    {
      id: "forum1",
      title: "¿Cuál es la mejor película de Christopher Nolan?",
      author: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
      replies: 42,
      lastActivity: "Hace 2 horas",
      category: "Debates",
    },
    {
      id: "forum2",
      title: "Análisis: El simbolismo en Dune: Parte Dos",
      author: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      replies: 28,
      lastActivity: "Hace 1 día",
      category: "Análisis",
    },
    {
      id: "forum3",
      title: "Recomendaciones de cine independiente 2024",
      author: {
        id: "user3",
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40&text=LM",
      },
      replies: 15,
      lastActivity: "Hace 3 días",
      category: "Recomendaciones",
    },
  ]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Búsqueda</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar películas, usuarios, foros..."
              className="pl-10"
              defaultValue="Dune"
            />
          </div>

          <div className="flex gap-2">
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los resultados</SelectItem>
                <SelectItem value="movies">Películas</SelectItem>
                <SelectItem value="users">Usuarios</SelectItem>
                <SelectItem value="forums">Foros</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-8">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="movies">Películas</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="forums">Foros</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Películas</h2>
                <Button variant="link" asChild>
                  <Link href="/search?type=movies">Ver todos</Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {movieResults.slice(0, 4).map((movie) => (
                  <Link href={`/movie/${movie.id}`} key={movie.id} className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={movie.image || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black bg-opacity-70 text-white">
                          ★ {movie.rating}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{movie.title}</h3>
                    <p className="text-sm text-gray-400">
                      {movie.year} • {movie.director}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Usuarios</h2>
                <Button variant="link" asChild>
                  <Link href="/search?type=users">Ver todos</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {userResults.map((user) => (
                  <Link
                    href={`/profile/${user.id}`}
                    key={user.id}
                    className="flex items-center p-4 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors"
                  >
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.username}</p>
                      <p className="text-xs text-gray-500">
                        {user.followers} seguidores • {user.reviews} reseñas
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Foros</h2>
                <Button variant="link" asChild>
                  <Link href="/search?type=forums">Ver todos</Link>
                </Button>
              </div>

              <div className="space-y-4">
                {forumResults.map((forum) => (
                  <Link
                    href={`/forums/thread/${forum.id}`}
                    key={forum.id}
                    className="block p-4 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{forum.title}</h3>
                      <Badge variant="outline">{forum.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarImage src={forum.author.avatar} alt={forum.author.name} />
                          <AvatarFallback>
                            {forum.author.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-400">{forum.author.name}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        {forum.replies} respuestas • {forum.lastActivity}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="movies">
          <div className="flex gap-6">
            <div className="hidden md:block w-[250px] shrink-0">
              <div className="sticky top-4 space-y-6">
                <div>
                  <h3 className="font-medium mb-3">Filtrar por género</h3>
                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="genres">
                      <AccordionTrigger className="py-2">Géneros</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="genre-action" className="mr-2" />
                            <label htmlFor="genre-action">Acción</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="genre-comedy" className="mr-2" />
                            <label htmlFor="genre-comedy">Comedia</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="genre-drama" className="mr-2" />
                            <label htmlFor="genre-drama">Drama</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="genre-scifi" className="mr-2" checked />
                            <label htmlFor="genre-scifi">Ciencia ficción</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="genre-horror" className="mr-2" />
                            <label htmlFor="genre-horror">Terror</label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="year">
                      <AccordionTrigger className="py-2">Año</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="year-2024" className="mr-2" checked />
                            <label htmlFor="year-2024">2024</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="year-2023" className="mr-2" checked />
                            <label htmlFor="year-2023">2023</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="year-2022" className="mr-2" />
                            <label htmlFor="year-2022">2022</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="year-2021" className="mr-2" />
                            <label htmlFor="year-2021">2021</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="year-older" className="mr-2" />
                            <label htmlFor="year-older">Anteriores</label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="rating">
                      <AccordionTrigger className="py-2">Valoración</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center">
                            <input type="checkbox" id="rating-5" className="mr-2" />
                            <label htmlFor="rating-5">5 estrellas</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="rating-4" className="mr-2" checked />
                            <label htmlFor="rating-4">4+ estrellas</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="rating-3" className="mr-2" />
                            <label htmlFor="rating-3">3+ estrellas</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="rating-2" className="mr-2" />
                            <label htmlFor="rating-2">2+ estrellas</label>
                          </div>
                          <div className="flex items-center">
                            <input type="checkbox" id="rating-1" className="mr-2" />
                            <label htmlFor="rating-1">1+ estrellas</label>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <Button className="w-full">Aplicar filtros</Button>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-400">Mostrando 4 resultados para "Dune"</p>
                <Select defaultValue="relevance">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevancia</SelectItem>
                    <SelectItem value="rating">Valoración</SelectItem>
                    <SelectItem value="year-desc">Año (más reciente)</SelectItem>
                    <SelectItem value="year-asc">Año (más antiguo)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {movieResults.map((movie) => (
                  <Link href={`/movie/${movie.id}`} key={movie.id} className="group">
                    <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                      <Image
                        src={movie.image || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-black bg-opacity-70 text-white">
                          ★ {movie.rating}
                        </Badge>
                      </div>
                    </div>
                    <h3 className="font-medium group-hover:text-primary transition-colors">{movie.title}</h3>
                    <p className="text-sm text-gray-400">
                      {movie.year} • {movie.director}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {movie.genres.map((genre) => (
                        <Badge key={genre} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users">
          <div className="mb-6">
            <p className="text-gray-400">Mostrando 3 resultados para "Dune"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userResults.map((user) => (
              <Link
                href={`/profile/${user.id}`}
                key={user.id}
                className="flex items-center p-4 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors"
              >
                <Avatar className="h-16 w-16 mr-4">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-gray-400">{user.username}</p>
                  <div className="flex gap-4 mt-1">
                    <p className="text-sm">
                      <span className="font-medium">{user.followers}</span> seguidores
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">{user.reviews}</span> reseñas
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="forums">
          <div className="mb-6">
            <p className="text-gray-400">Mostrando 3 resultados para "Dune"</p>
          </div>

          <div className="space-y-4">
            {forumResults.map((forum) => (
              <Link
                href={`/forums/thread/${forum.id}`}
                key={forum.id}
                className="block p-6 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium">{forum.title}</h3>
                  <Badge variant="outline">{forum.category}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={forum.author.avatar} alt={forum.author.name} />
                      <AvatarFallback>
                        {forum.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-gray-400">
                      Iniciado por <span className="text-primary">{forum.author.name}</span>
                    </span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {forum.replies} respuestas • {forum.lastActivity}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
