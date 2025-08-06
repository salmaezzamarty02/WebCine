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

interface EventRequestForm {
  title: string
  description: string
  longDescription: string
  date: string
  timeRange: string
  location: string
  address: string
  price: string
  maxAttendees: string
}

interface ScheduleItem {
  time: string
  activity: string
}

export default function RequestEventPage() {
  const router = useRouter()
  const user = useUser()
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState<EventRequestForm>({
    title: "",
    description: "",
    longDescription: "",
    date: "",
    timeRange: "",
    location: "",
    address: "",
    price: "",
    maxAttendees: "",
  })

  const [schedule, setSchedule] = useState<ScheduleItem[]>([{ time: "", activity: "" }])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
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

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile || !user) return null

    const ext = imageFile.name.split(".").pop()
    const filename = `${crypto.randomUUID()}.${ext}`

    const { data, error } = await supabase.storage
      .from("event-covers")
      .upload(filename, imageFile, {
        cacheControl: "3600",
        upsert: false,
        metadata: { user_id: user.id }
      })

    if (error) {
      console.error("Error subiendo imagen:", error)
      return null
    }

    const { data: urlData } = supabase.storage
      .from("event-covers")
      .getPublicUrl(data.path)

    return urlData?.publicUrl ?? null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)

    const imageUrl = await uploadImage()

    const { data: request, error } = await supabase
      .from("event_requests")
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
        image_url: imageUrl,
        max_attendees: parseInt(form.maxAttendees || "0"),
        status: "pending"
      })
      .select("id")
      .single()

    if (error || !request) {
      console.error("Error enviando solicitud", error)
      setLoading(false)
      return
    }

    const scheduleInserts = schedule
      .filter((s) => s.time && s.activity)
      .map((s) => ({
        request_id: request.id,
        time_range: s.time,
        activity: s.activity
      }))

    if (scheduleInserts.length > 0) {
      await supabase.from("event_request_schedule").insert(scheduleInserts)
    }

    router.push("/events?solicitud=enviada")
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Solicitar creación de evento</h1>

      {Object.entries({
        title: "Título",
        description: "Descripción corta",
        longDescription: "Descripción larga",
        date: "Fecha",
        timeRange: "Horario (ej: 18:00 - 23:00)",
        location: "Lugar",
        address: "Dirección",
        price: "Precio",
        maxAttendees: "Máximo de asistentes"
      }).map(([key, label]) => (
        <div key={key}>
          <Label htmlFor={key}>{label}</Label>
          {(key === "description" || key === "longDescription") ? (
            <Textarea id={key} name={key} value={form[key as keyof EventRequestForm]} onChange={handleChange} required />
          ) : (
            <Input id={key} name={key} value={form[key as keyof EventRequestForm]} onChange={handleChange} required />
          )}
        </div>
      ))}

      {/* Imagen */}
      <div>
        <Label>Imagen de portada</Label>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="rounded-md mb-2 w-full h-48 object-cover" />
        )}
        <Input type="file" accept="image/*" onChange={handleImageChange} required />
      </div>

      {/* Programa */}
      <div>
        <Label>Programa del evento</Label>
        <div className="space-y-4 mt-2">
          {schedule.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <Input
                placeholder="Hora (ej: 18:00 - 19:00)"
                value={item.time}
                onChange={(e) => handleScheduleChange(index, "time", e.target.value)}
              />
              <Input
                placeholder="Actividad"
                value={item.activity}
                onChange={(e) => handleScheduleChange(index, "activity", e.target.value)}
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
        {loading ? "Enviando..." : "Enviar solicitud"}
      </Button>
    </form>
  )
}
