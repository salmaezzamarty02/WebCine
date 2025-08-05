//app/forums/thread/[id]/ThreadContent.tsx
"use client"

import { useRef, useState } from "react"
import { addForumComment } from "@/lib/queries" 
import Link from "next/link"
import { useRouter } from "next/navigation"
import useUser from "@/lib/useUser"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    MessageSquare,
    ArrowLeft,
    Clock,
    Heart,
    Share,
    Flag,
    MoreHorizontal,
} from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

const supabase = createPagesBrowserClient()
export default function ThreadContent({ thread, replies, threadUser, categoryName }: any) {
    const [replyContent, setReplyContent] = useState("")
    const replyBoxRef = useRef<HTMLDivElement>(null)
    const user = useUser()
    const router = useRouter()

    const handleReply = async () => {
  if (!user?.id || !replyContent.trim()) {
    alert("Debes estar autenticado y escribir algo")
    return
  }

  try {
    await addForumComment({
      thread_id: thread.id,
      user_id: user.id,
      content: replyContent.trim(),
    })

    setReplyContent("")
    router.refresh()
  } catch (err) {
    console.error("Error al insertar comentario:", err)
    alert("Error al publicar el comentario")
  }
}


    const scrollToReplyBox = () => {
        replyBoxRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className="container py-8 px-4 md:px-6">
            {/* Encabezado */}
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
                        <Link href={`/forums/category/${thread.category_id}`}>{categoryName}</Link>
                    </Button>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-2">{thread.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{format(new Date(thread.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}</span>
                    </div>
                    <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span>{replies.length} respuestas</span>
                    </div>
                </div>
            </div>

            {/* Post original */}
            <div className="rounded-lg border border-gray-800 mb-8 p-4">
                <div className="flex gap-4 items-start">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={threadUser?.avatar || ""} />
                        <AvatarFallback>{threadUser?.username?.[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="text-sm text-gray-400 mb-1">
                            <Link href={`/profile/${threadUser?.id}`} className="font-medium text-white hover:underline">
                                {threadUser?.username}
                            </Link>{" "}
                            • {format(new Date(thread.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                        </div>
                        <div className="whitespace-pre-line text-gray-200 mb-4">{thread.content}</div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                                    <Heart className="h-4 w-4 mr-1" />
                                    <span>{thread.likes ?? 0}</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary" onClick={scrollToReplyBox}>
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

            {/* Respuestas */}
            <div className="space-y-6 mb-8">
                <h2 className="text-xl font-bold">Respuestas ({replies.length})</h2>

                {replies.map((reply: any) => {
                    const replyUser = Array.isArray(reply.user) ? reply.user[0] : reply.user

                    return (
                        <div key={reply.id} className="rounded-lg border border-gray-800 p-4">
                            <div className="flex gap-4 items-start">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={replyUser?.avatar || ""} />
                                    <AvatarFallback>
                                        {replyUser?.username?.[0] || "?"}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1">
                                    <div className="text-sm text-gray-400 mb-1">
                                        {replyUser?.username ? (
                                            <Link
                                                href={`/profile/${replyUser.id}`}
                                                className="font-medium text-white hover:underline"
                                            >
                                                {replyUser.username}
                                            </Link>
                                        ) : (
                                            <span className="italic text-gray-400">Anónimo</span>
                                        )}{" "}
                                        • {format(new Date(reply.created_at), "dd/MM/yyyy HH:mm:ss", { locale: es })}
                                    </div>
                                    <div className="whitespace-pre-line text-gray-200">{reply.content}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Formulario de respuesta */}
            <div ref={replyBoxRef} className="rounded-lg border border-gray-800 p-4 mb-12">
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
        </div>
    )
}
