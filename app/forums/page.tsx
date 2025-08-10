//app/forums/page.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, MessageSquare, Users, Clock, TrendingUp, Film, Tag } from "lucide-react"
import Link from "next/link"

export default function ForumsPage() {
  // Mock data
  const categories = [
    {
      id: "cat1",
      name: "General",
      description: "Discusiones generales sobre cine",
      icon: <Film className="h-5 w-5" />,
      threadCount: 156,
      color: "bg-blue-500",
    },
    {
      id: "cat2",
      name: "Recomendaciones",
      description: "Pide y comparte recomendaciones de películas",
      icon: <Tag className="h-5 w-5" />,
      threadCount: 98,
      color: "bg-green-500",
    },
    {
      id: "cat3",
      name: "Análisis y críticas",
      description: "Análisis en profundidad y críticas de películas",
      icon: <MessageSquare className="h-5 w-5" />,
      threadCount: 124,
      color: "bg-purple-500",
    },
    {
      id: "cat4",
      name: "Directores",
      description: "Discusiones sobre directores y sus filmografías",
      icon: <Users className="h-5 w-5" />,
      threadCount: 87,
      color: "bg-yellow-500",
    },
    {
      id: "cat5",
      name: "Géneros",
      description: "Debates sobre géneros cinematográficos",
      icon: <Tag className="h-5 w-5" />,
      threadCount: 112,
      color: "bg-red-500",
    },
  ]

  const recentThreads = [
    {
      id: "thread1",
      title: "¿Cuál es la mejor película de ciencia ficción de la última década?",
      category: "General",
      user: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      replies: 28,
      views: 142,
      lastActivity: "Hace 2 horas",
      isHot: true,
    },
    {
      id: "thread2",
      title: "Análisis: El simbolismo en 'Oppenheimer' de Christopher Nolan",
      category: "Análisis y críticas",
      user: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
      replies: 15,
      views: 89,
      lastActivity: "Hace 5 horas",
      isHot: false,
    },
    {
      id: "thread3",
      title: "Recomendaciones de películas similares a 'Todo a la vez en todas partes'",
      category: "Recomendaciones",
      user: {
        id: "user3",
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40&text=LM",
      },
      replies: 42,
      views: 210,
      lastActivity: "Hace 1 día",
      isHot: true,
    },
    {
      id: "thread4",
      title: "La evolución del cine de Yorgos Lanthimos",
      category: "Directores",
      user: {
        id: "user4",
        name: "Miguel Sánchez",
        avatar: "/placeholder.svg?height=40&width=40&text=MS",
      },
      replies: 19,
      views: 76,
      lastActivity: "Hace 2 días",
      isHot: false,
    },
    {
      id: "thread5",
      title: "¿Está muriendo el género de terror psicológico?",
      category: "Géneros",
      user: {
        id: "user5",
        name: "Elena Gómez",
        avatar: "/placeholder.svg?height=40&width=40&text=EG",
      },
      replies: 36,
      views: 184,
      lastActivity: "Hace 3 días",
      isHot: true,
    },
  ]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Foros</h1>
          <p className="text-gray-400">Participa en discusiones sobre cine con otros usuarios</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar en los foros..." className="pl-8 w-[200px] md:w-[250px]" />
          </div>
          <Button>
            <Link href="/forums/new">Nuevo tema</Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-8">
          <TabsTrigger value="categories">Categorías</TabsTrigger>
          <TabsTrigger value="recent">Recientes</TabsTrigger>
          <TabsTrigger value="popular">Populares</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/forums/category/${category.id}`}
                className="rounded-lg border border-gray-800 p-6 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`${category.color} rounded-full p-3 flex-shrink-0`}>{category.icon}</div>

                  <div className="flex-1">
                    <h2 className="text-xl font-bold mb-2">{category.name}</h2>
                    <p className="text-gray-400 mb-4">{category.description}</p>

                    <div className="flex items-center text-sm text-gray-500">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      <span>{category.threadCount} temas</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent">
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <div className="bg-card p-4 grid grid-cols-12 gap-4 text-sm font-medium border-b border-gray-800">
              <div className="col-span-6 md:col-span-7">Tema</div>
              <div className="col-span-2 text-center hidden md:block">Respuestas</div>
              <div className="col-span-2 text-center hidden md:block">Vistas</div>
              <div className="col-span-6 md:col-span-1 text-right">Actividad</div>
            </div>

            {recentThreads.map((thread) => (
              <div
                key={thread.id}
                className="p-4 grid grid-cols-12 gap-4 border-b border-gray-800 hover:bg-card/80 transition-colors"
              >
                <div className="col-span-6 md:col-span-7">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 hidden md:flex">
                      <AvatarImage src={thread.user.avatar} alt={thread.user.name} />
                      <AvatarFallback>{thread.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="flex items-center gap-2">
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

                      <div className="flex items-center mt-1 text-xs text-gray-500">
                        <Link href={`/profile/${thread.user.id}`} className="hover:underline mr-2">
                          {thread.user.name}
                        </Link>
                        <span>en</span>
                        <Badge variant="secondary" className="ml-2">
                          {thread.category}
                        </Badge>
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

        <TabsContent value="popular">
          <div className="rounded-lg border border-gray-800 overflow-hidden">
            <div className="bg-card p-4 grid grid-cols-12 gap-4 text-sm font-medium border-b border-gray-800">
              <div className="col-span-6 md:col-span-7">Tema</div>
              <div className="col-span-2 text-center hidden md:block">Respuestas</div>
              <div className="col-span-2 text-center hidden md:block">Vistas</div>
              <div className="col-span-6 md:col-span-1 text-right">Actividad</div>
            </div>

            {recentThreads
              .sort((a, b) => b.views - a.views)
              .map((thread) => (
                <div
                  key={thread.id}
                  className="p-4 grid grid-cols-12 gap-4 border-b border-gray-800 hover:bg-card/80 transition-colors"
                >
                  <div className="col-span-6 md:col-span-7">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8 hidden md:flex">
                        <AvatarImage src={thread.user.avatar} alt={thread.user.name} />
                        <AvatarFallback>{thread.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center gap-2">
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

                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <Link href={`/profile/${thread.user.id}`} className="hover:underline mr-2">
                            {thread.user.name}
                          </Link>
                          <span>en</span>
                          <Badge variant="secondary" className="ml-2">
                            {thread.category}
                          </Badge>
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
      </Tabs>
    </div>
  )
}
