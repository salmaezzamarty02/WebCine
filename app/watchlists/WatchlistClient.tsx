"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Film, Lock, Globe, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import useUser from "@/lib/useUser"
import { supabase } from "@/lib/supabaseClient"

export default function WatchlistClient() {
  const user = useUser()
  const [watchlists, setWatchlists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchWatchlists = async () => {
      const { data, error } = await supabase
        .from("watchlists")
        .select("*")
        .eq("user_id", user.id)

      if (!error) setWatchlists(data || [])
      setLoading(false)
    }

    fetchWatchlists()
  }, [user])

  if (!user || loading) {
    return <div className="text-gray-400">Cargando tus listas...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {watchlists.map((list) => (
        <div key={list.id} className="rounded-lg border border-gray-800 overflow-hidden group">
          <Link href={`/watchlists/${list.id}`} className="block">
            <div className="h-40 relative">
              <Image
                src={list.coverimage || "/placeholder.svg?height=300&width=600&text=Watchlist"}
                alt={list.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
              <div className="absolute bottom-3 right-3 flex items-center">
                <div className="bg-black/70 rounded-full p-1.5">
                  {list.privacy === "private" ? (
                    <Lock className="h-4 w-4" />
                  ) : (
                    <Globe className="h-4 w-4" />
                  )}
                </div>
              </div>
            </div>
          </Link>

          <div className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/watchlists/${list.id}`} className="block">
                  <h3 className="font-medium text-lg hover:text-primary transition-colors">{list.name}</h3>
                </Link>
                <p className="text-sm text-gray-400 mt-1">{list.description}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Editar</DropdownMenuItem>
                  <DropdownMenuItem>Compartir</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">Eliminar</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center">
                <Film className="h-4 w-4 mr-1 text-gray-400" />
                <span className="text-sm text-gray-400">{/* Aquí podrías poner el conteo de películas si lo calculas */}0 películas</span>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(list.created_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>
      ))}

      {/* Card para crear nueva lista */}
      <div className="rounded-lg border border-dashed border-gray-700 flex flex-col items-center justify-center p-8 h-full min-h-[250px]">
        <div className="bg-gray-800 rounded-full p-3 mb-4">
          <Plus className="h-6 w-6" />
        </div>
        <h3 className="font-medium text-lg mb-2">Crear nueva lista</h3>
        <p className="text-sm text-gray-400 text-center mb-4">Organiza tus películas favoritas o pendientes</p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva lista
        </Button>
      </div>
    </div>
  )
}
