"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageSquare, UserPlus, Calendar, Bell, Check, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([
    {
      id: "notif1",
      type: "like",
      read: false,
      user: {
        id: "user1",
        name: "Ana García",
        avatar: "/placeholder.svg?height=40&width=40&text=AG",
      },
      content: {
        type: "review",
        id: "review1",
        title: "Dune: Parte Dos",
      },
      timestamp: "Hace 2 horas",
    },
    {
      id: "notif2",
      type: "comment",
      read: false,
      user: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/placeholder.svg?height=40&width=40&text=CR",
      },
      content: {
        type: "review",
        id: "review1",
        title: "Dune: Parte Dos",
        text: "Totalmente de acuerdo con tu análisis. La fotografía es espectacular.",
      },
      timestamp: "Hace 3 horas",
    },
    {
      id: "notif3",
      type: "follow",
      read: true,
      user: {
        id: "user3",
        name: "Laura Martínez",
        avatar: "/placeholder.svg?height=40&width=40&text=LM",
      },
      timestamp: "Hace 1 día",
    },
    {
      id: "notif4",
      type: "rating",
      read: true,
      user: {
        id: "user4",
        name: "Miguel Sánchez",
        avatar: "/placeholder.svg?height=40&width=40&text=MS",
      },
      content: {
        type: "movie",
        id: "movie2",
        title: "Oppenheimer",
        rating: 4.5,
      },
      timestamp: "Hace 2 días",
    },
    {
      id: "notif5",
      type: "event",
      read: true,
      user: {
        id: "user5",
        name: "Elena Gómez",
        avatar: "/placeholder.svg?height=40&width=40&text=EG",
      },
      content: {
        type: "event",
        id: "event1",
        title: "Maratón de Ciencia Ficción",
      },
      timestamp: "Hace 3 días",
    },
  ])

  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id))
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Notificaciones</h1>
          <p className="text-gray-400">Mantente al día con la actividad relacionada con tu cuenta</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={markAllAsRead}>
            <Check className="mr-2 h-4 w-4" />
            Marcar todo como leído
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-4 mb-8">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="interactions">Interacciones</TabsTrigger>
          <TabsTrigger value="follows">Seguidores</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border ${notification.read ? "border-gray-800" : "border-primary bg-gray-900/30"}`}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={notification.user.avatar || "/placeholder.svg"} alt={notification.user.name} />
                      <AvatarFallback>{notification.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div className="flex-1">
                          {notification.type === "like" && (
                            <p>
                              <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                                {notification.user.name}
                              </Link>{" "}
                              le ha gustado tu reseña de{" "}
                              <Link href={`/movie/${notification.content.id}`} className="font-medium hover:underline">
                                {notification.content.title}
                              </Link>
                            </p>
                          )}

                          {notification.type === "comment" && (
                            <>
                              <p>
                                <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                                  {notification.user.name}
                                </Link>{" "}
                                ha comentado en tu reseña de{" "}
                                <Link
                                  href={`/movie/${notification.content.id}`}
                                  className="font-medium hover:underline"
                                >
                                  {notification.content.title}
                                </Link>
                              </p>
                              <p className="text-sm text-gray-400 mt-1 bg-gray-800 p-2 rounded-md">
                                "{notification.content.text}"
                              </p>
                            </>
                          )}

                          {notification.type === "follow" && (
                            <p>
                              <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                                {notification.user.name}
                              </Link>{" "}
                              ha comenzado a seguirte
                            </p>
                          )}

                          {notification.type === "rating" && (
                            <p>
                              <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                                {notification.user.name}
                              </Link>{" "}
                              ha valorado{" "}
                              <Link href={`/movie/${notification.content.id}`} className="font-medium hover:underline">
                                {notification.content.title}
                              </Link>{" "}
                              con {notification.content.rating} estrellas
                            </p>
                          )}

                          {notification.type === "event" && (
                            <p>
                              <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                                {notification.user.name}
                              </Link>{" "}
                              te ha invitado al evento{" "}
                              <Link href={`/events/${notification.content.id}`} className="font-medium hover:underline">
                                {notification.content.title}
                              </Link>
                            </p>
                          )}

                          <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                        </div>

                        <div className="flex items-start gap-2">
                          {!notification.read && <Badge className="bg-primary text-white">Nuevo</Badge>}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {!notification.read && (
                                <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                  <Check className="mr-2 h-4 w-4" />
                                  Marcar como leída
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                Eliminar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-3">
                        {notification.type === "follow" && (
                          <Button size="sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Seguir
                          </Button>
                        )}

                        {notification.type === "event" && (
                          <Button size="sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            Ver evento
                          </Button>
                        )}

                        {(notification.type === "like" || notification.type === "comment") && (
                          <Button size="sm" variant="outline">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Responder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No tienes notificaciones</h3>
                <p className="text-gray-400">
                  Las notificaciones aparecerán aquí cuando haya actividad relacionada con tu cuenta
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="interactions">
          <div className="space-y-4">
            {notifications.filter((n) => n.type === "like" || n.type === "comment" || n.type === "rating").length >
            0 ? (
              notifications
                .filter((n) => n.type === "like" || n.type === "comment" || n.type === "rating")
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${notification.read ? "border-gray-800" : "border-primary bg-gray-900/30"}`}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={notification.user.avatar || "/placeholder.svg"}
                          alt={notification.user.name}
                        />
                        <AvatarFallback>{notification.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            {notification.type === "like" && (
                              <p>
                                <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                                  {notification.user.name}
                                </Link>{" "}
                                le ha gustado tu reseña de{" "}
                                <Link
                                  href={`/movie/${notification.content.id}`}
                                  className="font-medium hover:underline"
                                >
                                  {notification.content.title}
                                </Link>
                              </p>
                            )}

                            {notification.type === "comment" && (
                              <>
                                <p>
                                  <Link
                                    href={`/profile/${notification.user.id}`}
                                    className="font-medium hover:underline"
                                  >
                                    {notification.user.name}
                                  </Link>{" "}
                                  ha comentado en tu reseña de{" "}
                                  <Link
                                    href={`/movie/${notification.content.id}`}
                                    className="font-medium hover:underline"
                                  >
                                    {notification.content.title}
                                  </Link>
                                </p>
                                <p className="text-sm text-gray-400 mt-1 bg-gray-800 p-2 rounded-md">
                                  "{notification.content.text}"
                                </p>
                              </>
                            )}

                            {notification.type === "rating" && (
                              <p>
                                <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                                  {notification.user.name}
                                </Link>{" "}
                                ha valorado{" "}
                                <Link
                                  href={`/movie/${notification.content.id}`}
                                  className="font-medium hover:underline"
                                >
                                  {notification.content.title}
                                </Link>{" "}
                                con {notification.content.rating} estrellas
                              </p>
                            )}

                            <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                          </div>

                          <div className="flex items-start gap-2">
                            {!notification.read && <Badge className="bg-primary text-white">Nuevo</Badge>}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.read && (
                                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Marcar como leída
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          {(notification.type === "like" || notification.type === "comment") && (
                            <Button size="sm" variant="outline">
                              <MessageSquare className="mr-2 h-4 w-4" />
                              Responder
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No tienes interacciones</h3>
                <p className="text-gray-400">
                  Las interacciones aparecerán aquí cuando otros usuarios interactúen con tu contenido
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="follows">
          <div className="space-y-4">
            {notifications.filter((n) => n.type === "follow").length > 0 ? (
              notifications
                .filter((n) => n.type === "follow")
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${notification.read ? "border-gray-800" : "border-primary bg-gray-900/30"}`}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={notification.user.avatar || "/placeholder.svg"}
                          alt={notification.user.name}
                        />
                        <AvatarFallback>{notification.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <p>
                              <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                                {notification.user.name}
                              </Link>{" "}
                              ha comenzado a seguirte
                            </p>

                            <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                          </div>

                          <div className="flex items-start gap-2">
                            {!notification.read && <Badge className="bg-primary text-white">Nuevo</Badge>}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.read && (
                                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Marcar como leída
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button size="sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Seguir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No tienes nuevos seguidores</h3>
                <p className="text-gray-400">Las notificaciones de nuevos seguidores aparecerán aquí</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events">
          <div className="space-y-4">
            {notifications.filter((n) => n.type === "event").length > 0 ? (
              notifications
                .filter((n) => n.type === "event")
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border ${notification.read ? "border-gray-800" : "border-primary bg-gray-900/30"}`}
                  >
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={notification.user.avatar || "/placeholder.svg"}
                          alt={notification.user.name}
                        />
                        <AvatarFallback>{notification.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div className="flex-1">
                            <p>
                              <Link href={`/profile/${notification.user.id}`} className="font-medium hover:underline">
                                {notification.user.name}
                              </Link>{" "}
                              te ha invitado al evento{" "}
                              <Link href={`/events/${notification.content.id}`} className="font-medium hover:underline">
                                {notification.content.title}
                              </Link>
                            </p>

                            <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                          </div>

                          <div className="flex items-start gap-2">
                            {!notification.read && <Badge className="bg-primary text-white">Nuevo</Badge>}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.read && (
                                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                    <Check className="mr-2 h-4 w-4" />
                                    Marcar como leída
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => deleteNotification(notification.id)}>
                                  Eliminar
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <Button size="sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            Ver evento
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">No tienes notificaciones de eventos</h3>
                <p className="text-gray-400">Las invitaciones a eventos y actualizaciones aparecerán aquí</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
