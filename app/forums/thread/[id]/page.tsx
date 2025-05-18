"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Heart, MessageSquare, Share, Flag, MoreHorizontal, Clock } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function ThreadPage({ params }: { params: { id: string } }) {
  const [replyContent, setReplyContent] = useState("")

  // Mock data for a thread
  const thread = {
    id: params.id,
    title: "¿Cuál es la mejor película de ciencia ficción de la última década?",
    category: {
      id: "cat1",
      name: "General",
    },
    content: `Estoy buscando recomendaciones de las mejores películas de ciencia ficción de los últimos 10 años.

Personalmente, creo que "Arrival" (2016) de Denis Villeneuve es una de las mejores por su enfoque único en la lingüística y la comunicación con extraterrestres, además de su narrativa no lineal que juega con la percepción del tiempo.

También me gustaron mucho "Ex Machina" (2014), "Interstellar" (2014) y "Blade Runner 2049" (2017).

¿Cuáles son vuestras favoritas y por qué? ¿Hay alguna joya menos conocida que recomendaríais?`,
    user: {
      id: "user1",
      name: "Ana García",
      avatar: "/placeholder.svg?height=40&width=40&text=AG",
      joinDate: "Miembro desde enero 2022",
      posts: 156,
    },
    createdAt: "15 abril, 2024 - 14:32",
    views: 142,
    likes: 24,
    replies: [
      {
        id: "reply1",
        content: `Para mí, "Dune" (2021) es una de las mejores películas de ciencia ficción recientes. La adaptación de Villeneuve captura perfectamente la esencia del libro y crea un mundo visualmente impresionante.

También recomendaría "Mad Max: Fury Road" (2015) si te gustan las películas de acción con elementos de ciencia ficción post-apocalíptica.

Una joya menos conocida sería "Upgrade" (2018), que tiene una premisa interesante sobre la tecnología y la inteligencia artificial.`,
        user: {
          id: "user2",
          name: "Carlos Rodríguez",
          avatar: "/placeholder.svg?height=40&width=40&text=CR",
          joinDate: "Miembro desde marzo 2021",
          posts: 89,
        },
        createdAt: "15 abril, 2024 - 15:10",
        likes: 12,
      },
      {
        id: "reply2",
        content: `Coincido con "Arrival", es una película excepcional. Añadiría "Annihilation" (2018) a la lista, tiene un enfoque muy interesante sobre la vida extraterrestre y la autodestrucción.

"Her" (2013) también es una película de ciencia ficción brillante que explora la relación entre humanos e IA de una manera muy emotiva.

Y si buscas algo menos conocido, te recomendaría "Coherence" (2013), una película de bajo presupuesto pero con un concepto fascinante sobre realidades paralelas.`,
        user: {
          id: "user3",
          name: "Laura Martínez",
          avatar: "/placeholder.svg?height=40&width=40&text=LM",
          joinDate: "Miembro desde junio 2023",
          posts: 42,
        },
        createdAt: "15 abril, 2024 - 16:45",
        likes: 8,
      },
      {
        id: "reply3",
        content: `No puedo creer que nadie haya mencionado "Todo a la vez en todas partes" (2022). Aunque mezcla varios géneros, tiene elementos de ciencia ficción muy interesantes con su concepto del multiverso.

También recomendaría "Snowpiercer" (2013) de Bong Joon-ho, una distopía fascinante ambientada en un tren.

Y si te gustan las series, "Severance" en Apple TV+ es una de las mejores propuestas de ciencia ficción recientes.`,
        user: {
          id: "user4",
          name: "Miguel Sánchez",
          avatar: "/placeholder.svg?height=40&width=40&text=MS",
          joinDate: "Miembro desde octubre 2020",
          posts: 215,
        },
        createdAt: "15 abril, 2024 - 18:22",
        likes: 15,
      },
    ],
  }

  const handleReply = () => {
    if (replyContent.trim()) {
      // In a real app, this would send the reply to the server
      console.log("Sending reply:", replyContent)
      setReplyContent("")
    }
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      {/* Thread Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/forums">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Volver a los foros
            </Link>
          </Button>
          <div className="text-gray-400">/</div>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/forums/category/${thread.category.id}`}>{thread.category.name}</Link>
          </Button>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-2">{thread.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-400">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            <span>{thread.createdAt}</span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>{thread.replies.length} respuestas</span>
          </div>
        </div>
      </div>

      {/* Original Post */}
      <div className="rounded-lg border border-gray-800 mb-8">
        <div className="p-4 border-b border-gray-800 bg-card">
          <div className="flex items-start gap-4">
            <div className="hidden md:block">
              <Avatar className="h-10 w-10">
                <AvatarImage src={thread.user.avatar} alt={thread.user.name} />
                <AvatarFallback>{thread.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="md:hidden">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={thread.user.avatar} alt={thread.user.name} />
                      <AvatarFallback>{thread.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <Link href={`/profile/${thread.user.id}`} className="font-medium hover:underline">
                      {thread.user.name}
                    </Link>
                    <div className="text-xs text-gray-500 flex flex-col md:flex-row md:gap-2">
                      <span>{thread.user.joinDate}</span>
                      <span className="hidden md:inline">•</span>
                      <span>{thread.user.posts} publicaciones</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-gray-500">{thread.createdAt}</div>
              </div>

              <div className="mt-4 whitespace-pre-line text-gray-200">{thread.content}</div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                    <Heart className="h-4 w-4 mr-1" />
                    <span>{thread.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span>Responder</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                    <Share className="h-4 w-4 mr-1" />
                    <span>Compartir</span>
                  </Button>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Reportar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Replies */}
      <div className="space-y-6 mb-8">
        <h2 className="text-xl font-bold">Respuestas ({thread.replies.length})</h2>

        {thread.replies.map((reply) => (
          <div key={reply.id} className="rounded-lg border border-gray-800">
            <div className="p-4">
              <div className="flex items-start gap-4">
                <div className="hidden md:block">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                    <AvatarFallback>{reply.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="md:hidden">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                          <AvatarFallback>{reply.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </div>
                      <div>
                        <Link href={`/profile/${reply.user.id}`} className="font-medium hover:underline">
                          {reply.user.name}
                        </Link>
                        <div className="text-xs text-gray-500 flex flex-col md:flex-row md:gap-2">
                          <span>{reply.user.joinDate}</span>
                          <span className="hidden md:inline">•</span>
                          <span>{reply.user.posts} publicaciones</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500">{reply.createdAt}</div>
                  </div>

                  <div className="mt-4 whitespace-pre-line text-gray-200">{reply.content}</div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                        <Heart className="h-4 w-4 mr-1" />
                        <span>{reply.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>Responder</span>
                      </Button>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Flag className="h-4 w-4 mr-2" />
                          Reportar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <div className="rounded-lg border border-gray-800 p-4">
        <h3 className="font-medium mb-4">Responder a este tema</h3>
        <Textarea
          placeholder="Escribe tu respuesta..."
          className="mb-4 min-h-[150px]"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
        <div className="flex justify-end">
          <Button onClick={handleReply} disabled={!replyContent.trim()}>
            Publicar respuesta
          </Button>
        </div>
      </div>

      {/* Related Threads */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Temas relacionados</h3>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-gray-800 p-4 hover:bg-card/80 transition-colors">
              <Link href={`/forums/thread/${i}`} className="block">
                <h4 className="font-medium hover:text-primary">
                  {i === 1 && "Las mejores películas de ciencia ficción de 2023"}
                  {i === 2 && "Debate: ¿Es Interstellar la mejor película de ciencia ficción de la década?"}
                  {i === 3 && "Recomendaciones de ciencia ficción hard"}
                </h4>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <div className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    <span>{10 + i * 5} respuestas</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Hace {i} días</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
