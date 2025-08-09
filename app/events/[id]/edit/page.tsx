"use client"

import { useEffect, useState, ChangeEvent, FormEvent } from "react"
import { useRouter, useParams } from "next/navigation"
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

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams() as { id: string }
  const user = useUser()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

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
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")

  useEffect(() => {
    const loadEvent = async () => {
      const { data: event } = await supabase.from("events").select("*").eq("id", params.id).single()
      const { data: eventSchedule } = await supabase.from("event_schedule").select("*").eq("event_id", params.id)

      if (event) {
        setForm({
          title: event.title || "",
          description: event.description || "",
          longDescription: event.long_description || "",
          date: event.date || "",
          timeRange: event.time_range || "",
          location: event.location || "",
          address: event.address || "",
          price: event.price || "",
          maxAttendees: event.max_attendees?.toString() || "",
          imageUrl: event.image_url || ""
        })
        setImagePreview(event.image_url || "")
      }

      setSchedule(
        eventSchedule?.map((item) => ({
          time: item.time_range,
          activity: item.activity
        })) || [{ time: "", activity: "" }]
      )

      setInitialLoading(false)
    }

    loadEvent()
  }, [params.id])

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

  const handleAddSchedule = () => setSchedule([...schedule, { time: "", activity: "" }])
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

    const { data: urlData } = supabase.storage.from("event-covers").getPublicUrl(data.path)
    return urlData?.publicUrl ?? null
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    let imageUrl = form.imageUrl
    if (imageFile) {
      const uploaded = await uploadImage()
      if (uploaded) imageUrl = uploaded
    }

    const { error: updateError } = await supabase
      .from("events")
      .update({
        title: form.title,
        description: form.description,
        long_description: form.longDescription,
        date: form.date,
        time_range: form.timeRange,
        location: form.location,
        address: form.address,
        price: form.price,
        image_url: imageUrl,
        max_attendees: parseInt(form.maxAttendees || "0")
      })
      .eq("id", params.id)

    if (updateError) {
      console.error("Error actualizando evento", updateError)
      setLoading(false)
      return
    }

    await supabase.from("event_schedule").delete().eq("event_id", params.id)

    const scheduleToInsert = schedule
      .filter((s) => s.time && s.activity)
      .map((s) => ({
        event_id: params.id,
        time_range: s.time,
        activity: s.activity
      }))

    if (scheduleToInsert.length > 0) {
      await supabase.from("event_schedule").insert(scheduleToInsert)
    }

    router.push(`/events/${params.id}`)
  }

  if (initialLoading) return <p className="text-center mt-10">Cargando evento...</p>

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Editar evento</h1>

      {/* Campos de texto */}
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
            <Textarea id={key} name={key} value={form[key as keyof EventForm]} onChange={handleChange} required />
          ) : (
            <Input id={key} name={key} value={form[key as keyof EventForm]} onChange={handleChange} required />
          )}
        </div>
      ))}

      {/* Imagen */}
      <div>
        <Label>Imagen de portada</Label>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="rounded-md mb-2 w-full h-48 object-cover" />
        )}
        <Input type="file" accept="image/*" onChange={handleImageChange} />
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
        {loading ? "Guardando..." : "Guardar cambios"}
      </Button>
    </form>
  )
}
