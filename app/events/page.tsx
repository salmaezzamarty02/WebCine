"use client"

import { useEffect, useState } from "react"
import { getEvents, type EventWithExtras } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Calendar, MapPin, Users, Clock, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function EventsPage() {
  const [events, setEvents] = useState<EventWithExtras[]>([])
  const today = new Date()

  useEffect(() => {
    getEvents().then(setEvents).catch(console.error)
  }, [])

  const upcomingEvents = events.filter(e => new Date(e.date) >= today)
  const pastEvents = events.filter(e => new Date(e.date) < today)

  return (
    <div className="container py-8 px-4 md:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Eventos</h1>
          <p className="text-gray-400">Descubra y participe en eventos relacionados con el cine</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar eventos..." className="pl-8 w-[200px] md:w-[250px]" />
          </div>
          <Button asChild>
            <Link href="/events/request">
              <Plus className="mr-2 h-4 w-4" />
              Solicitar creación de evento
            </Link>
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="past">Pasados</TabsTrigger>
        </TabsList>

        {/* Próximos */}
        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map(event => (
              <div key={event.id} className="rounded-lg border border-gray-800 overflow-hidden">
                <div className="h-48 relative">
                  <Image src={event.image_url || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">
                      <Link href={`/events/${event.id}`} className="hover:underline">
                        {event.title}
                      </Link>
                    </h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Más opciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Compartir</DropdownMenuItem>
                        <DropdownMenuItem>Reportar</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.time_range}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {event.attendees} / {event.max_attendees ?? "—"} asistentes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={event.organizer?.avatar || ""} alt={event.organizer?.name || ""} />
                        <AvatarFallback>
                          {(event.organizer?.name ?? "")
                            .trim()
                            .split(/\s+/)
                            .filter(Boolean)
                            .map((w: string) => w.charAt(0))
                            .join("") || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-400">
                        Organizado por{" "}
                        <Link href={`/profile/${event.organizer?.id}`} className="text-primary hover:underline">
                          {event.organizer?.name ?? "Usuario"}
                        </Link>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button className="w-full">
                      Confirmar asistencia
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Pasados */}
        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map(event => (
              <div key={event.id} className="rounded-lg border border-gray-800 overflow-hidden opacity-80">
                <div className="h-48 relative">
                  <Image src={event.image_url || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Finalizado
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold">
                    <Link href={`/events/${event.id}`} className="hover:underline">
                      {event.title}
                    </Link>
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
