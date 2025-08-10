import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, MessageSquare, Users, Clock, TrendingUp, ArrowLeft, Pin, Lock } from "lucide-react"
import Link from "next/link"

export default function ForumCategoryPage({ params }: { params: { id: string } }) {
  // Mock data based on category
  const categories = {
    cat1: {
      name: "General",
      description: "Discusiones generales sobre cine",
      color: "bg-blue-500",
    },
    cat2: {
      name: "Recomendaciones",
      description: "Pide y comparte recomendaciones de películas",
      color: "bg-green-500",
    },
    cat3: {
      name: "Análisis y críticas",
      description: "Análisis en profundidad y críticas de películas",
      color: "bg-purple-500",
    },
    cat4: {
      name: "Directores",
      description: "Discusiones sobre directores y sus filmografías",
      color: "bg-yellow-500",
    },
    cat5: {
      name: "Géneros",
      description: "Debates sobre géneros cinematográficos",
      color: "bg-red-500",
    },
  }

  const category = categories[params.id as keyof typeof categories] || categories.cat1

  const threads = [
    {
      id: "thread1",
      title: "¿Cuál es la mejor película de ciencia ficción de la última década?",
      content: "Estoy buscando recomendaciones de las mejores películas de ciencia ficción...",
      user: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      replies: 28,
      views: 142,
      lastActivity: "Hace 2 horas",
      isHot: true,
      isPinned: false,
      isLocked: false,
      createdAt: "15 abril, 2024",
    },
    {
      id: "thread2",
      title: "Análisis: El simbolismo en 'Oppenheimer' de Christopher Nolan",
      content: "Una discusión profunda sobre los elementos simbólicos en la última película de Nolan...",
      user: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
      replies: 15,
      views: 89,
      lastActivity: "Hace 5 horas",
      isHot: false,
      isPinned: true,
      isLocked: false,
      createdAt: "14 abril, 2024",
    },
    {
      id: "thread3",
      title: "Recomendaciones de películas similares a 'Todo a la vez en todas partes'",
      content: "Busco películas con narrativas complejas y elementos surrealistas...",
      user: {
        id: "user3",
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40&text=LM",
      },
      replies: 42,
      views: 210,
      lastActivity: "Hace 1 día",
      isHot: true,
      isPinned: false,
      isLocked: false,
      createdAt: "13 abril, 2024",
    },
    {
      id: "thread4",
      title: "La evolución del cine de Yorgos Lanthimos",
      content: "Un análisis de la filmografía completa del director griego...",
      user: {
        id: "user4",
        name: "Miguel Sánchez",
        avatar: "/placeholder.svg?height=40&width=40&text=MS",
      },
      replies: 19,
      views: 76,
      lastActivity: "Hace 2 días",
      isHot: false,
      isPinned: false,
      isLocked: true,
      createdAt: "12 abril, 2024",
    },
  ]

  return (
    <div className="container py-8 px-4 md:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/forums">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Foros
          </Link>
        </Button>
        <div className="text-gray-400">/</div>
        <span className="text-sm font-medium">{category.name}</span>
      </div>

      {/* Category Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className={`${category.color} rounded-full p-4`}>
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
            <p className="text-gray-400">{category.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar en esta categoría..." className="pl-8 w-[200px] md:w-[250px]" />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo tema
          </Button>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="rounded-lg border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary">{threads.length}</div>
          <div className="text-sm text-gray-400">Temas</div>
        </div>
        <div className="rounded-lg border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary">{threads.reduce((acc, t) => acc + t.replies, 0)}</div>
          <div className="text-sm text-gray-400">Respuestas</div>
        </div>
        <div className="rounded-lg border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary">{threads.reduce((acc, t) => acc + t.views, 0)}</div>
          <div className="text-sm text-gray-400">Vistas</div>
        </div>
        <div className="rounded-lg border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary">24</div>
          <div className="text-sm text-gray-400">Miembros activos</div>
        </div>
      </div>

      <Tabs defaultValue="recent" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-6">
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="popular">Populares</TabsTrigger>
          <TabsTrigger value="unanswered">Sin responder</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <div className="bg-card p-4 grid grid-cols-12 gap-4 text-sm font-medium border-b border-gray-800">
              <div className="col-span-6 md:col-span-7">Tema</div>
              <div className="col-span-2 text-center hidden md:block">Respuestas</div>
              <div className="col-span-2 text-center hidden md:block">Vistas</div>
              <div className="col-span-6 md:col-span-1 text-right">Actividad</div>
            </div>

            {threads.map((thread) => (
              <div
                key={thread.id}
                className="p-4 grid grid-cols-12 gap-4 border-b border-gray-800 hover:bg-card/80 transition-colors"
              >
                <div className="col-span-6 md:col-span-7">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 hidden md:flex">
                      <AvatarImage src={thread.user.avatar || "/placeholder.svg"} alt={thread.user.name} />
                      <AvatarFallback>{thread.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {thread.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                        {thread.isLocked && <Lock className="h-4 w-4 text-gray-500" />}
                        <Link href={`/forums/thread/${thread.id}`} className="font-medium hover:text-primary">
                          {thread.title}
                        </Link>
                        {thread.isHot && (
                          <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center text-xs text-gray-500">
                        <Link href={`/profile/${thread.user.id}`} className="hover:underline mr-2">
                          {thread.user.name}
                        </Link>
                        <span>•</span>
                        <span className="ml-2">{thread.createdAt}</span>
                      </div>

                      <p className="text-sm text-gray-400 mt-1 line-clamp-2 md:hidden">{thread.content}</p>
                    </div>
                  </div>
                </div>

                <div className="col-span-2 text-center hidden md:flex items-center justify-center">
                  <div className="flex items-center">
                    <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{thread.replies}</span>
                  </div>
                </div>

                <div className="col-span-2 text-center hidden md:flex items-center justify-center">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{thread.views}</span>
                  </div>
                </div>

                <div className="col-span-6 md:col-span-1 text-right flex items-center justify-end">
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{thread.lastActivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular">
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <div className="bg-card p-4 grid grid-cols-12 gap-4 text-sm font-medium border-b border-gray-800">
              <div className="col-span-6 md:col-span-7">Tema</div>
              <div className="col-span-2 text-center hidden md:block">Respuestas</div>
              <div className="col-span-2 text-center hidden md:block">Vistas</div>
              <div className="col-span-6 md:col-span-1 text-right">Actividad</div>
            </div>

            {threads
              .sort((a, b) => b.views - a.views)
              .map((thread) => (
                <div
                  key={thread.id}
                  className="p-4 grid grid-cols-12 gap-4 border-b border-gray-800 hover:bg-card/80 transition-colors"
                >
                  <div className="col-span-6 md:col-span-7">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 hidden md:flex">
                        <AvatarImage src={thread.user.avatar || "/placeholder.svg"} alt={thread.user.name} />
                        <AvatarFallback>{thread.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {thread.isPinned && <Pin className="h-4 w-4 text-yellow-500" />}
                          {thread.isLocked && <Lock className="h-4 w-4 text-gray-500" />}
                          <Link href={`/forums/thread/${thread.id}`} className="font-medium hover:text-primary">
                            {thread.title}
                          </Link>
                          {thread.isHot && (
                            <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Popular
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <Link href={`/profile/${thread.user.id}`} className="hover:underline mr-2">
                            {thread.user.name}
                          </Link>
                          <span>•</span>
                          <span className="ml-2">{thread.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-center hidden md:flex items-center justify-center">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{thread.replies}</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-center hidden md:flex items-center justify-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{thread.views}</span>
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-1 text-right flex items-center justify-end">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{thread.lastActivity}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="unanswered">
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <div className="bg-card p-4 grid grid-cols-12 gap-4 text-sm font-medium border-b border-gray-800">
              <div className="col-span-6 md:col-span-7">Tema</div>
              <div className="col-span-2 text-center hidden md:block">Respuestas</div>
              <div className="col-span-2 text-center hidden md:block">Vistas</div>
              <div className="col-span-6 md:col-span-1 text-right">Actividad</div>
            </div>

            {threads
              .filter((thread) => thread.replies === 0)
              .map((thread) => (
                <div
                  key={thread.id}
                  className="p-4 grid grid-cols-12 gap-4 border-b border-gray-800 hover:bg-card/80 transition-colors"
                >
                  <div className="col-span-6 md:col-span-7">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 hidden md:flex">
                        <AvatarImage src={thread.user.avatar || "/placeholder.svg"} alt={thread.user.name} />
                        <AvatarFallback>{thread.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/forums/thread/${thread.id}`} className="font-medium hover:text-primary">
                            {thread.title}
                          </Link>
                          <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                            Sin responder
                          </Badge>
                        </div>

                        <div className="flex items-center text-xs text-gray-500">
                          <Link href={`/profile/${thread.user.id}`} className="hover:underline mr-2">
                            {thread.user.name}
                          </Link>
                          <span>•</span>
                          <span className="ml-2">{thread.createdAt}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 text-center hidden md:flex items-center justify-center">
                    <div className="flex items-center">
                      <MessageSquare className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{thread.replies}</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-center hidden md:flex items-center justify-center">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-gray-500" />
                      <span>{thread.views}</span>
                    </div>
                  </div>

                  <div className="col-span-6 md:col-span-1 text-right flex items-center justify-end">
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{thread.lastActivity}</span>
                    </div>
                  </div>
                </div>
              ))}

            {threads.filter((thread) => thread.replies === 0).length === 0 && (
              <div className="p-8 text-center text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No hay temas sin responder en esta categoría</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Active Members */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Miembros activos en esta categoría</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Link
              key={i}
              href={`/profile/user${i}`}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-800 hover:bg-card/80 transition-colors"
            >
              <Avatar className="h-12 w-12 mb-2">
                <AvatarImage src={`/placeholder.svg?height=48&width=48&text=U${i}`} alt={`Usuario ${i}`} />
                <AvatarFallback>U{i}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium text-center">Usuario {i}</div>
              <div className="text-xs text-gray-400">{10 + i * 3} posts</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
