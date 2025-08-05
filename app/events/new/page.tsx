"use client"

import { useState, ChangeEvent, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import useUser from "@/lib/useUser"

interface EventForm {
  title: string
  description: string
  longDescription: string
  date: string
  timeRange: string
  location: string
  address: string
  price: string
  maxAttendees: string
  imageUrl: string
}

interface ScheduleItem {
  time: string
  activity: string
}

export default function CreateEventPage() {
  const router = useRouter()
  const user = useUser()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<EventForm>({
    title: "",
    description: "",
    longDescription: "",
    date: "",
    timeRange: "",
    location: "",
    address: "",
    price: "",
    maxAttendees: "",
    imageUrl: ""
  })

  const [schedule, setSchedule] = useState<ScheduleItem[]>([{ time: "", activity: "" }])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    const newSchedule = [...schedule]
    newSchedule[index][field] = value
    setSchedule(newSchedule)
  }

  const handleAddSchedule = () => {
    setSchedule([...schedule, { time: "", activity: "" }])
  }

  const handleRemoveSchedule = (index: number) => {
    const newSchedule = [...schedule]
    newSchedule.splice(index, 1)
    setSchedule(newSchedule)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    const { data: event, error } = await supabase
      .from("events")
      .insert({
        user_id: user.id,
        title: form.title,
        description: form.description,
        long_description: form.longDescription,
        date: form.date,
        time_range: form.timeRange,
        location: form.location,
        address: form.address,
        price: form.price,
        image_url: form.imageUrl,
        max_attendees: parseInt(form.maxAttendees || "0"),
      })
      .select("id")
      .single()

    if (error || !event) {
      console.error("Error creando evento", error)
      setLoading(false)
      return
    }

    const scheduleInserts = schedule
      .filter((s) => s.time && s.activity)
      .map((s) => ({ event_id: event.id, time_range: s.time, activity: s.activity }))

    if (scheduleInserts.length > 0) {
      await supabase.from("event_schedule").insert(scheduleInserts)
    }

    router.push(`/events/${event.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Crear nuevo evento</h1>

      {Object.entries({
        title: "Título",
        description: "Descripción corta",
        longDescription: "Descripción larga",
        date: "Fecha",
        timeRange: "Horario (ej: 18:00 - 23:00)",
        location: "Lugar",
        address: "Dirección",
        price: "Precio",
        maxAttendees: "Máximo de asistentes",
        imageUrl: "URL de la imagen de portada"
      }).map(([key, label]) => (
        <div key={key}>
          <Label htmlFor={key}>{label}</Label>
          {(key === "description" || key === "longDescription") ? (
            <Textarea id={key} name={key} value={form[key as keyof EventForm]} onChange={handleChange} required />
          ) : (
            <Input id={key} name={key} value={form[key as keyof EventForm]} onChange={handleChange} required />
          )}
        </div>
      ))}

      <div>
        <Label>Programa del evento</Label>
        <div className="space-y-4 mt-2">
          {schedule.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Hora (ej: 18:00 - 19:00)"
                value={item.time}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleScheduleChange(index, "time", e.target.value)}
              />
              <Input
                placeholder="Actividad"
                value={item.activity}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleScheduleChange(index, "activity", e.target.value)}
              />
              <Button type="button" variant="ghost" onClick={() => handleRemoveSchedule(index)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={handleAddSchedule}>
            <Plus className="h-4 w-4 mr-1" /> Añadir bloque
          </Button>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Crear evento"}
      </Button>
    </form>
  )
}
