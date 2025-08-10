"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Clock } from "lucide-react"
import Link from "next/link"

type User = { id: string; name: string | null; username: string | null; avatar: string | null } | null
export type ThreadItem = {
  id: string
  title: string
  content: string
  created_at: string
  lastActivity: string
  replies: number
  user: User
}

function ThreadsTable({ items }: { items: ThreadItem[] }) {
  return (
    <div className="rounded-lg border border-gray-800 overflow-hidden">
      <div className="bg-card p-4 grid grid-cols-12 gap-4 text-sm font-medium border-b border-gray-800">
        <div className="col-span-6 md:col-span-9">Tema</div>
        <div className="col-span-2 text-center hidden md:block">Respuestas</div>
        <div className="col-span-6 md:col-span-1 text-right">Actividad</div>
      </div>

      {items.map((thread) => (
        <div
          key={thread.id}
          className="p-4 grid grid-cols-12 gap-4 border-b border-gray-800 hover:bg-card/80 transition-colors"
        >
          <div className="col-span-6 md:col-span-9">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8 hidden md:flex">
                <AvatarImage src={thread.user?.avatar || "/placeholder.svg"} alt={thread.user?.name ?? ""} />
                <AvatarFallback>
                  {(thread.user?.name ?? thread.user?.username ?? "U").substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Link href={`/forums/thread/${thread.id}`} className="font-medium hover:text-primary">
                    {thread.title}
                  </Link>
                </div>

                <div className="flex items-center text-xs text-gray-500">
                  {thread.user?.id ? (
                    <Link href={`/profile/${thread.user.id}`} className="hover:underline mr-2">
                      {thread.user?.name ?? thread.user?.username ?? "Usuario"}
                    </Link>
                  ) : (
                    <span className="mr-2">Anónimo</span>
                  )}
                  <span>•</span>
                  <span className="ml-2">
                    {new Date(thread.created_at).toLocaleDateString("es-ES", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
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

          <div className="col-span-6 md:col-span-1 text-right flex items-center justify-end">
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {new Date(thread.lastActivity).toLocaleString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="p-8 text-center text-gray-400">No hay temas en esta pestaña.</div>
      )}
    </div>
  )
}

export default function CategoryThreadsTabs({
  recent,
  popular,
  unanswered,
}: {
  recent: ThreadItem[]
  popular: ThreadItem[]
  unanswered: ThreadItem[]
}) {
  return (
    <Tabs defaultValue="recent" className="w-full">
      <TabsList className="w-full grid grid-cols-3 mb-6">
        <TabsTrigger value="recent">Recientes</TabsTrigger>
        <TabsTrigger value="popular">Populares</TabsTrigger>
        <TabsTrigger value="unanswered">Sin responder</TabsTrigger>
      </TabsList>

      <TabsContent value="recent">
        <ThreadsTable items={recent} />
      </TabsContent>

      <TabsContent value="popular">
        <ThreadsTable items={popular} />
      </TabsContent>

      <TabsContent value="unanswered">
        <ThreadsTable items={unanswered} />
      </TabsContent>
    </Tabs>
  )
}
