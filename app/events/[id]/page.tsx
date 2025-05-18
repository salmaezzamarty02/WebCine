import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Clock, ArrowLeft, Share2, Flag, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function EventPage({ params }: { params: { id: string } }) {
  // Mock data for a single event
  const event = {
    id: params.id,
    title: "Maratón de Ciencia Ficción",
    description:
      "Disfruta de una noche completa con las mejores películas de ciencia ficción de los últimos años. Incluye Dune, Blade Runner 2049 y Arrival. Habrá debate después de cada película y un pequeño descanso con refrigerios incluidos en el precio de la entrada.\n\nLos asistentes recibirán un póster exclusivo del evento y podrán participar en un sorteo de merchandising oficial de las películas proyectadas.",
    longDescription:
      "El cine de ciencia ficción ha sido siempre un vehículo para explorar las posibilidades del futuro y reflexionar sobre el presente. En esta maratón, hemos seleccionado tres obras maestras contemporáneas que representan lo mejor del género en los últimos años.\n\nComenzaremos con 'Arrival' (2016) de Denis Villeneuve, una reflexión sobre el lenguaje, la comunicación y la percepción del tiempo. Seguiremos con 'Blade Runner 2049' (2017), también de Villeneuve, que expande el universo creado por Ridley Scott y profundiza en temas como la identidad y la memoria. Finalizaremos con 'Dune' (2021), la adaptación de la novela de Frank Herbert que explora política, religión y ecología en un futuro lejano.\n\nEntre cada película habrá un descanso de 20 minutos y un debate moderado por críticos de cine especializados en el género.",
    date: "15 de junio, 2024",
    time: "18:00 - 23:00",
    location: "Cine Doré, Madrid",
    address: "Calle de Santa Isabel, 3, 28012 Madrid",
    price: "15€",
    organizer: {
      id: "user1",
      name: "Ana García",
      avatar: "/placeholder.svg?height=40&width=40&text=AG",
    },
    attendees: 28,
    maxAttendees: 50,
    image: "/placeholder.svg?height=600&width=1200&text=Sci-Fi+Marathon",
    isAttending: false,
    schedule: [
      { time: "18:00 - 18:15", activity: "Bienvenida y presentación" },
      { time: "18:15 - 20:00", activity: "Proyección: Arrival (2016)" },
      { time: "20:00 - 20:30", activity: "Debate y descanso con refrigerios" },
      { time: "20:30 - 22:15", activity: "Proyección: Blade Runner 2049 (selección de escenas)" },
      { time: "22:15 - 22:30", activity: "Descanso" },
      { time: "22:30 - 23:00", activity: "Proyección: Dune (escenas seleccionadas) y debate final" },
    ],
    attendeesList: [
      { id: "user2", name: "Carlos Rodríguez", avatar: "/placeholder.svg?height=40&width=40&text=CR" },
      { id: "user3", name: "Laura Martínez", avatar: "/placeholder.svg?height=40&width=40&text=LM" },
      { id: "user4", name: "Miguel Sánchez", avatar: "/placeholder.svg?height=40&width=40&text=MS" },
      { id: "user5", name: "Elena Gómez", avatar: "/placeholder.svg?height=40&width=40&text=EG" },
      { id: "user6", name: "Javier López", avatar: "/placeholder.svg?height=40&width=40&text=JL" },
      // More attendees would be here
    ],
    comments: [
      {
        id: "comment1",
        user: { id: "user2", name: "Carlos Rodríguez", avatar: "/placeholder.svg?height=40&width=40&text=CR" },
        text: "¿Alguien sabe si habrá subtítulos en español para todas las películas?",
        timestamp: "Hace 2 días",
        replies: [
          {
            id: "reply1",
            user: { id: "user1", name: "Ana García", avatar: "/placeholder.svg?height=40&width=40&text=AG" },
            text: "¡Hola Carlos! Sí, todas las películas tendrán subtítulos en español.",
            timestamp: "Hace 2 días",
          },
        ],
      },
      {
        id: "comment2",
        user: { id: "user5", name: "Elena Gómez", avatar: "/placeholder.svg?height=40&width=40&text=EG" },
        text: "¡Qué ganas tengo de ver Dune en pantalla grande otra vez! ¿Alguien va desde la zona norte de Madrid?",
        timestamp: "Hace 1 día",
        replies: [],
      },
    ],
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-6">
        <Link href="/events" className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a eventos
        </Link>

        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-6">
          <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
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
                <AvatarImage src={event.organizer.avatar} alt={event.organizer.name} />
                <AvatarFallback>
                  {event.organizer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-400">Organizado por</p>
                <Link href={`/profile/${event.organizer.id}`} className="text-primary hover:underline font-medium">
                  {event.organizer.name}
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
                <span>{event.time}</span>
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
                <span>
                  {event.attendees} / {event.maxAttendees} asistentes
                </span>
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
                  <p>{event.longDescription}</p>
                </div>
              </TabsContent>

              <TabsContent value="schedule">
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex border-l-2 border-primary pl-4">
                      <div className="min-w-[120px] font-medium">{item.time}</div>
                      <div>{item.activity}</div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="attendees">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {event.attendeesList.map((attendee) => (
                    <Link
                      href={`/profile/${attendee.id}`}
                      key={attendee.id}
                      className="flex items-center p-3 rounded-lg border border-gray-800 hover:bg-gray-800 transition-colors"
                    >
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={attendee.avatar} alt={attendee.name} />
                        <AvatarFallback>
                          {attendee.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{attendee.name}</span>
                    </Link>
                  ))}
                  {event.attendees > event.attendeesList.length && (
                    <div className="flex items-center justify-center p-3 rounded-lg border border-gray-800">
                      <span className="text-gray-400">+{event.attendees - event.attendeesList.length} más</span>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Comentarios ({event.comments.length})</h2>
              <div className="space-y-6">
                {event.comments.map((comment) => (
                  <div key={comment.id} className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                        <AvatarFallback>
                          {comment.user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Link href={`/profile/${comment.user.id}`} className="font-medium hover:underline">
                            {comment.user.name}
                          </Link>
                          <span className="text-xs text-gray-400">{comment.timestamp}</span>
                        </div>
                        <p className="text-gray-200">{comment.text}</p>
                        <Button variant="ghost" size="sm" className="mt-1 h-8 text-xs text-gray-400">
                          <MessageSquare className="h-3 w-3 mr-1" />
                          Responder
                        </Button>
                      </div>
                    </div>

                    {comment.replies.length > 0 && (
                      <div className="pl-12 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                              <AvatarFallback>
                                {reply.user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Link href={`/profile/${reply.user.id}`} className="font-medium hover:underline">
                                  {reply.user.name}
                                </Link>
                                <span className="text-xs text-gray-400">{reply.timestamp}</span>
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

              <Button className="w-full mb-4" variant={event.isAttending ? "secondary" : "default"}>
                {event.isAttending ? "Cancelar asistencia" : "Confirmar asistencia"}
              </Button>

              <div className="text-center text-sm text-gray-400">
                <p>Quedan {event.maxAttendees - event.attendees} plazas disponibles</p>
              </div>
            </div>

            <div className="p-6 border border-gray-800 rounded-lg">
              <h3 className="font-medium mb-3">Comparte este evento</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Twitter
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Facebook
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
