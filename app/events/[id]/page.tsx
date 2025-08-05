//app/events/[id]/page.tsx
"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Flag } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function EventPage() {
  const params = useParams()
  const id = params?.id as string

  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchEvent = async () => {
      const { data: eventData, error } = await supabase
        .from("events")
        .select(`*, schedule:event_schedule(time_range, activity), attendees:event_attendees(user_id), comments:event_comments(id, text, created_at, user_id, replies:event_comment_replies(id, text, created_at, user_id))`)
        .eq("id", id)
        .single()

      if (error || !eventData) {
        console.error("Error al cargar el evento:", error)
        setLoading(false)
        return
      }

      const { data: user } = await supabase
        .from("profiles")
        .select("id, name, avatar")
        .eq("id", eventData.user_id)
        .single()

      const fetchUser = async (userId: string) => {
        const { data } = await supabase.from("profiles").select("id, name, avatar").eq("id", userId).single()
        return data
      }

      for (const comment of eventData.comments) {
        comment.user = await fetchUser(comment.user_id)
        for (const reply of comment.replies) {
          reply.user = await fetchUser(reply.user_id)
        }
      }

      setEvent({ ...eventData, user })
      setLoading(false)
    }

    fetchEvent()
  }, [id])

  if (!id) return <div className="text-gray-400">Cargando ID del evento...</div>
  if (loading) return <div className="text-gray-400">Cargando evento...</div>
  if (!event) return <div className="text-red-500">Evento no encontrado.</div>

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/events" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a eventos
        </Link>

        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
          <Image src={event.image_url || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Compartir</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Flag className="h-4 w-4" />
                  <span className="sr-only">Reportar</span>
                </Button>
              </div>
            </div>

            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={event.user.avatar} alt={event.user.name} />
                <AvatarFallback>{event.user.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-400">Organizado por</p>
                <Link href={`/profile/${event.user.id}`} className="text-primary hover:underline font-medium">
                  {event.user.name}
                </Link>
              </div>
            </div>

            <div className="space-y-3 mb-8 p-4 bg-gray-900 rounded-lg">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-gray-400" />
                <span>{event.time_range}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <p>{event.location}</p>
                  <p className="text-sm text-gray-400">{event.address}</p>
                </div>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-3 text-gray-400" />
                <span>{event.attendees?.length || 0} / {event.max_attendees} asistentes</span>
              </div>
            </div>

            <Tabs defaultValue="about" className="w-full mb-8">
              <TabsList className="w-full grid grid-cols-3 mb-6">
                <TabsTrigger value="about">Acerca de</TabsTrigger>
                <TabsTrigger value="schedule">Programa</TabsTrigger>
                <TabsTrigger value="attendees">Asistentes</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg">{event.description}</p>
                  <p>{event.long_description}</p>
                </div>
              </TabsContent>

              <TabsContent value="schedule">
                <div className="space-y-4">
                  {event.schedule.map((item: any, index: number) => (
                    <div key={index} className="flex border-l-2 border-primary pl-4">
                      <div className="min-w-[120px] font-medium">{item.time_range}</div>
                      <div>{item.activity}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="attendees">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.attendees.map((attendee: any) => (
                    <Link
                      href={`/profile/${attendee.user_id}`}
                      key={attendee.user_id}
                      className="flex items-center p-3 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>👤</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">Usuario</span>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Comentarios ({event.comments.length})</h2>
              <div className="space-y-6">
                {event.comments.map((comment: any) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                        <AvatarFallback>{comment.user.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/profile/${comment.user.id}`} className="font-medium hover:underline">
                            {comment.user.name}
                          </Link>
                          <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-200">{comment.text}</p>
                      </div>
                    </div>

                    {comment.replies.length > 0 && (
                      <div className="pl-12 space-y-4">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                              <AvatarFallback>{reply.user.name.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Link href={`/profile/${reply.user.id}`} className="font-medium hover:underline">
                                  {reply.user.name}
                                </Link>
                                <span className="text-xs text-gray-400">{new Date(reply.created_at).toLocaleDateString()}</span>
                              </div>
                              <p className="text-gray-200">{reply.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-[300px] space-y-6">
            <div className="p-6 border border-gray-800 rounded-lg">
              <div className="mb-4">
                <p className="text-2xl font-bold mb-1">{event.price}</p>
                <p className="text-sm text-gray-400">por persona</p>
              </div>
              <Button className="w-full mb-4">Confirmar asistencia</Button>
              <div className="text-center text-sm text-gray-400">
                <p>Quedan {event.max_attendees - event.attendees.length} plazas disponibles</p>
              </div>
            </div>
            <div className="p-6 border border-gray-800 rounded-lg">
              <h3 className="font-medium mb-3">Comparte este evento</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">Twitter</Button>
                <Button variant="outline" size="sm" className="flex-1">Facebook</Button>
                <Button variant="outline" size="sm" className="flex-1">WhatsApp</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}