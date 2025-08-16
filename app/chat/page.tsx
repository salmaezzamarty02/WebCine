"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Send,
  ImageIcon,
  Paperclip,
  MoreHorizontal,
  Film,
  Check,
  CheckCheck,
  MessageSquare,
  ArrowLeft,
} from "lucide-react"
import Image from "next/image"

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [activeChat, setActiveChat] = useState<string | null>("chat1") // Set default active chat and allow null
  const [showChatList, setShowChatList] = useState(true) // For mobile navigation

  // Mock data
  const chats = [
    {
      id: "chat1",
      user: {
        id: "user1",
        name: "Ana García",
        avatar: "/dune.jpeg?height=40&width=40&text=AG",
        online: true,
      },
      lastMessage: {
        text: "¿Has visto la nueva película de Villeneuve?",
        time: "14:32",
        isRead: true,
        isMine: false,
      },
      unreadCount: 0,
    },
    {
      id: "chat2",
      user: {
        id: "user2",
        name: "Carlos Rodríguez",
        avatar: "/dune.jpeg?height=40&width=40&text=CR",
        online: false,
      },
      lastMessage: {
        text: "Te envié mi reseña de Oppenheimer",
        time: "Ayer",
        isRead: true,
        isMine: true,
      },
      unreadCount: 0,
    },
    {
      id: "chat3",
      user: {
        id: "user3",
        name: "Laura Martínez",
        avatar: "/dune.jpeg?height=40&width=40&text=LM",
        online: true,
      },
      lastMessage: {
        text: "¿Vamos al cine este fin de semana?",
        time: "Ayer",
        isRead: false,
        isMine: false,
      },
      unreadCount: 3,
    },
    {
      id: "chat4",
      user: {
        id: "user4",
        name: "Miguel Sánchez",
        avatar: "/dune.jpeg?height=40&width=40&text=MS",
        online: false,
      },
      lastMessage: {
        text: "Gracias por la recomendación",
        time: "Lunes",
        isRead: true,
        isMine: false,
      },
      unreadCount: 0,
    },
    {
      id: "chat5",
      user: {
        id: "user5",
        name: "Elena Gómez",
        avatar: "/dune.jpeg?height=40&width=40&text=EG",
        online: false,
      },
      lastMessage: {
        text: "¿Qué te pareció el final?",
        time: "23/03/24",
        isRead: true,
        isMine: true,
      },
      unreadCount: 0,
    },
  ]

  const activeMessages = [
    {
      id: "msg1",
      text: "Hola, ¿qué tal estás?",
      time: "14:20",
      isMine: false,
      status: "read",
    },
    {
      id: "msg2",
      text: "¡Hola! Todo bien, ¿y tú?",
      time: "14:22",
      isMine: true,
      status: "read",
    },
    {
      id: "msg3",
      text: "Bien también. ¿Has visto la nueva película de Villeneuve?",
      time: "14:25",
      isMine: false,
      status: "read",
    },
    {
      id: "msg4",
      text: "¿Te refieres a Dune: Parte Dos? Sí, la vi el fin de semana pasado. Me pareció increíble, especialmente las escenas en Arrakis.",
      time: "14:28",
      isMine: true,
      status: "read",
    },
    {
      id: "msg5",
      text: "Mira, aquí tengo una imagen de mi escena favorita:",
      time: "14:29",
      isMine: true,
      status: "read",
    },
    {
      id: "msg6",
      image: "/dune.jpeg?height=300&width=500&text=Dune+Scene",
      time: "14:29",
      isMine: true,
      status: "read",
    },
    {
      id: "msg7",
      text: "¡Wow! Esa escena es impresionante. La fotografía es espectacular.",
      time: "14:31",
      isMine: false,
      status: "read",
    },
    {
      id: "msg8",
      text: "¿Has visto la nueva película de Villeneuve?",
      time: "14:32",
      isMine: false,
      status: "read",
    },
  ]

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId)
    setShowChatList(false) // Hide chat list on mobile when chat is selected
  }

  return (
    <div className="container h-[calc(100vh-4rem)] py-6 px-0 md:px-6">
      <div className="flex h-full border border-gray-800 rounded-lg overflow-hidden">
        {/* Chat List */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-gray-800 flex flex-col ${
            showChatList ? "block" : "hidden md:block"
          }`}
        >
          <div className="p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold mb-4">Mensajes</h1>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar conversaciones..." className="pl-8" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className={`w-full text-left p-4 border-b border-gray-800 hover:bg-card/80 transition-colors ${
                  activeChat === chat.id ? "bg-card" : ""
                }`}
                onClick={() => handleChatSelect(chat.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.user.avatar || "/dune.jpeg"} alt={chat.user.name} />
                      <AvatarFallback>{chat.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {chat.user.online && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium truncate">{chat.user.name}</span>
                      <span className="text-xs text-gray-500">{chat.lastMessage.time}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-400 truncate">
                        {chat.lastMessage.isMine && (
                          <span className="mr-1">
                            {chat.lastMessage.isRead ? (
                              <CheckCheck className="inline h-3 w-3 text-primary" />
                            ) : (
                              <Check className="inline h-3 w-3" />
                            )}
                          </span>
                        )}
                        {chat.lastMessage.text}
                      </p>

                      {chat.unreadCount > 0 && <Badge className="ml-2 bg-primary text-white">{chat.unreadCount}</Badge>}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${!showChatList ? "block" : "hidden md:flex"}`}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowChatList(true)}>
                    <ArrowLeft className="h-5 w-5" />
                  </Button>

                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={chats.find((c) => c.id === activeChat)?.user.avatar || "/dune.jpeg"}
                      alt={chats.find((c) => c.id === activeChat)?.user.name}
                    />
                    <AvatarFallback>
                      {chats
                        .find((c) => c.id === activeChat)
                        ?.user.name.substring(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="font-medium">{chats.find((c) => c.id === activeChat)?.user.name}</div>
                    <div className="text-xs text-gray-500">
                      {chats.find((c) => c.id === activeChat)?.user.online ? (
                        <span className="text-green-500">En línea</span>
                      ) : (
                        <span>Último acceso: Hoy 12:45</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Film className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.isMine ? "bg-primary text-primary-foreground" : "bg-card border border-gray-800"
                      }`}
                    >
                      {msg.text && <p className="mb-1">{msg.text}</p>}

                      {msg.image && (
                        <div className="rounded-md overflow-hidden mb-1">
                          <Image
                            src={msg.image || "/dune.jpeg"}
                            alt="Shared image"
                            width={300}
                            height={200}
                            className="w-full h-auto"
                          />
                        </div>
                      )}

                      <div
                        className={`text-xs flex items-center justify-end gap-1 ${
                          msg.isMine ? "text-primary-foreground/70" : "text-gray-500"
                        }`}
                      >
                        <span>{msg.time}</span>
                        {msg.isMine &&
                          (msg.status === "read" ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="h-5 w-5" />
                  </Button>

                  <Input
                    placeholder="Escribe un mensaje..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1"
                  />

                  <Button size="icon" onClick={handleSendMessage} disabled={!message.trim()}>
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-gray-800 rounded-full p-6 mb-4">
                <MessageSquare className="h-10 w-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">Tus mensajes</h2>
              <p className="text-gray-400 mb-6 max-w-md">
                Envía mensajes privados a otros usuarios para hablar sobre películas, organizar eventos o simplemente
                charlar.
              </p>
              <Button>Iniciar nueva conversación</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
