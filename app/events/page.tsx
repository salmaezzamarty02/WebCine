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
  // Mock data
  const upcomingEvents = [
    {
      id: "event1",
      title: "Maratón de Ciencia Ficción",
      description:
        "Disfruta de una noche completa con las mejores películas de ciencia ficción de los últimos años. Incluye Dune, Blade Runner 2049 y Arrival.",
      date: "15 de junio, 2024",
      time: "18:00 - 23:00",
      location: "Cine Doré, Madrid",
      organizer: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      attendees: 28,
      maxAttendees: 50,
      image: "/placeholder.svg?height=400&width=800&text=Sci-Fi+Marathon",
      isAttending: false,
    },
    {
      id: "event2",
      title: "Debate: El cine de Almodóvar",
      description:
        "Charla y debate sobre la filmografía completa de Pedro Almodóvar, su evolución como director y su impacto en el cine español e internacional.",
      date: "22 de junio, 2024",
      time: "19:30 - 21:00",
      location: "Online (Zoom)",
      organizer: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
      attendees: 45,
      maxAttendees: 100,
      image: "/placeholder.svg?height=400&width=800&text=Almodovar",
      isAttending: true,
    },
    {
      id: "event3",
      title: "Proyección: Clásicos del cine negro",
      description:
        "Proyección especial de 'El halcón maltés' (1941) seguida de un coloquio sobre el cine negro clásico y su influencia en el cine moderno.",
      date: "30 de junio, 2024",
      time: "20:00 - 22:30",
      location: "Cineteca, Madrid",
      organizer: {
        id: "user3",
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40&text=LM",
      },
      attendees: 32,
      maxAttendees: 60,
      image: "/placeholder.svg?height=400&width=800&text=Film+Noir",
      isAttending: false,
    },
  ]

  const pastEvents = [
    {
      id: "event4",
      title: "Estreno: Dune: Parte Dos",
      description:
        "Evento especial de estreno con proyección en IMAX y debate posterior sobre la adaptación de la novela de Frank Herbert.",
      date: "1 de marzo, 2024",
      time: "19:00 - 23:00",
      location: "Cinesa La Maquinista, Barcelona",
      organizer: {
        id: "user4",
        name: "Miguel Sánchez",
        avatar: "/placeholder.svg?height=40&width=40&text=MS",
      },
      attendees: 75,
      maxAttendees: 80,
      image: "/placeholder.svg?height=400&width=800&text=Dune+Premiere",
      isAttending: true,
    },
    {
      id: "event5",
      title: "Taller de análisis cinematográfico",
      description:
        "Taller práctico para aprender a analizar películas desde diferentes perspectivas: narrativa, visual, sonora y temática.",
      date: "15 de abril, 2024",
      time: "11:00 - 14:00",
      location: "Escuela de Cine, Madrid",
      organizer: {
        id: "user5",
        name: "Elena Gómez",
        avatar: "/placeholder.svg?height=40&width=40&text=EG",
      },
      attendees: 20,
      maxAttendees: 20,
      image: "/placeholder.svg?height=400&width=800&text=Film+Analysis",
      isAttending: true,
    },
  ]

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Eventos</h1>
          <p className="text-gray-400">Descubre y participa en eventos relacionados con el cine</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar eventos..." className="pl-8 w-[200px] md:w-[250px]" />
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Solicitar creación de evento
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-8">
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="past">Pasados</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="rounded-lg border border-gray-800 overflow-hidden">
                <div className="h-48 relative">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{event.title}</h3>
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
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {event.attendees} / {event.maxAttendees} asistentes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                        <AvatarFallback>
                          {event.organizer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-400">
                        Organizado por{" "}
                        <Link href={`/profile/${event.organizer.id}`} className="text-primary hover:underline">
                          {event.organizer.name}
                        </Link>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button className="w-full" variant={event.isAttending ? "secondary" : "default"}>
                      {event.isAttending ? "Cancelar asistencia" : "Confirmar asistencia"}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pastEvents.map((event) => (
              <div key={event.id} className="rounded-lg border border-gray-800 overflow-hidden opacity-80">
                <div className="h-48 relative">
                  <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      Finalizado
                    </Badge>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Más opciones</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Ver fotos</DropdownMenuItem>
                        <DropdownMenuItem>Ver reseñas</DropdownMenuItem>
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
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-400" />
                      <span>
                        {event.attendees} / {event.maxAttendees} asistentes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                        <AvatarFallback>
                          {event.organizer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-400">
                        Organizado por{" "}
                        <Link href={`/profile/${event.organizer.id}`} className="text-primary hover:underline">
                          {event.organizer.name}
                        </Link>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button className="w-full" variant="outline">
                      {event.isAttending ? "Asististe a este evento" : "No asististe a este evento"}
                    </Button>
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
