"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import useUser from "@/lib/useUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Settings,
  UserPlus,
  MessageSquare,
  MoreHorizontal,
  MapPin,
  Calendar,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"

export default function ProfileClient({ userId }: { userId: string }) {
  const [profile, setProfile] = useState<any>(null)
  const user = useUser()
  const isOwnProfile = user?.id === userId

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (data) setProfile(data)
    }

    fetchProfile()
  }, [userId])

  if (!profile) return <p className="p-4">Cargando perfil...</p>

  return (
    <div>
      {/* Cabecera del perfil */}
      <div className="relative">
        <div className="h-48 md:h-64 relative">
          <Image
            src={profile.coverImage || "/placeholder.svg"}
            alt="Cover"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 md:-mt-20">
            <Avatar className="h-32 w-32 border-4 border-background">
              <AvatarImage
                src={profile.avatar || "/placeholder.svg"}
                alt={profile.name}
              />
              <AvatarFallback>
                {profile.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{profile.name}</h1>
              <p className="text-gray-400">@{profile.username}</p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              {isOwnProfile ? (
                <Button asChild variant="outline">
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Editar perfil
                  </Link>
                </Button>
              ) : (
                <>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Seguir
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Mensaje
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Bloquear usuario</DropdownMenuItem>
                      <DropdownMenuItem>Reportar</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 mb-8">
            <p className="text-gray-200 mb-4">{profile.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{profile.location}</span>
                </div>
              )}
              {profile.created_at && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    Miembro desde{" "}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sección mock */}
      <div className="container py-8 px-4 md:px-6">
        <h2 className="text-xl text-gray-400">
          Aquí irán tus películas favoritas, listas, amigos... (mock)
        </h2>
      </div>
    </div>
  )
}
