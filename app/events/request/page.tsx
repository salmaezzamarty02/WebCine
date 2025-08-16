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

  try {
    // 1) Asegurar que el perfil existe (por la FK a profiles)
    const { data: profileRow, error: profileErr } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()

    if (profileErr) throw profileErr

    if (!profileRow) {
      // Cree un perfil mínimo; ajuste campos si los necesita
      const { error: upsertErr } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email ?? null,
        username: user.user_metadata?.username ?? null,
        name: user.user_metadata?.name ?? null
      })
      if (upsertErr) throw upsertErr
    }

    // 2) Subida de imagen (puede devolver null y es válido)
    const imageUrl = await uploadImage()

    // 3) Asegurar formato de fecha ISO (si su input no es type="date")
    const isoDate =
      /^\d{4}-\d{2}-\d{2}$/.test(form.date)
        ? form.date
        : new Date(form.date).toISOString().slice(0, 10)

    // 4) Insert de la solicitud
    const { data: request, error } = await supabase
      .from("event_requests")
      .insert({
        user_id: user.id,
        title: form.title.trim(),
        description: form.description?.trim() || null,
        long_description: form.longDescription?.trim() || null,
        date: isoDate,
        time_range: form.timeRange?.trim() || null,
        location: form.location?.trim() || null,
        address: form.address?.trim() || null,
        price: form.price?.trim() || null,
        image_url: imageUrl || null,
        max_attendees: Number.isNaN(parseInt(form.maxAttendees)) ? null : parseInt(form.maxAttendees),
        status: "pending"
      })
      .select("id")
      .single()

    if (error || !request) throw error ?? new Error("No se devolvió la solicitud creada")

    // 5) Insert del programa si procede
    const scheduleInserts = schedule
      .filter((s) => s.time && s.activity)
      .map((s) => ({
        request_id: request.id,
        time_range: s.time.trim(),
        activity: s.activity.trim()
      }))

    if (scheduleInserts.length > 0) {
      const { error: schErr } = await supabase
        .from("event_request_schedule")
        .insert(scheduleInserts)
      if (schErr) throw schErr
    }

    router.push("/events?solicitud=enviada")
  } catch (err) {
    console.error("Error enviando solicitud:", err)
  } finally {
    setLoading(false)
  }
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
