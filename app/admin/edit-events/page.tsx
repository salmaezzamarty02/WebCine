"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Search } from "lucide-react"

export default function AdminEventListPage() {
  const router = useRouter()
  const [events, setEvents] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filteredEvents, setFilteredEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true })

      if (error) {
        console.error("Error al cargar eventos", error)
      } else {
        setEvents(data || [])
        setFilteredEvents(data || [])
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    const query = search.toLowerCase()
    setFilteredEvents(
      events.filter((event) => event.title.toLowerCase().includes(query))
    )
  }, [search, events])

  const handleDelete = async (id: string, title: string) => {
    const confirmed = confirm(`¿Seguro que quieres eliminar el evento "${title}"?`)
    if (!confirmed) return

    const { error } = await supabase.from("events").delete().eq("id", id)
    if (error) {
      alert("Error al eliminar el evento")
      console.error(error)
    } else {
      alert("Evento eliminado correctamente")
      setEvents((prev) => prev.filter((e) => e.id !== id))
    }
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Editar eventos</h1>
          <p className="text-muted-foreground">Gestiona todos los eventos publicados</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar eventos..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={() => router.push("/events/new")}>Nuevo evento</Button>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">No se encontraron eventos.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-3 shadow-sm bg-card hover:shadow-md transition"
            >
              <div className="relative h-40 w-full rounded mb-3 overflow-hidden">
                <Image
                  src={event.image_url || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3 className="font-semibold text-sm truncate">{event.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{event.date}</p>

              <div className="flex gap-2">
                <Button size="sm" onClick={() => router.push(`/events/${event.id}/edit`)}>
                  Editar
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(event.id, event.title)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
