//app/watchlists/[id]/edit/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import useUser from "@/lib/useUser"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, X, Lock, Globe, Search, Upload } from "lucide-react"
import Image from "next/image"
import { supabase } from "@/lib/supabaseClient"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"

export default function EditWatchlistPage() {
  const router = useRouter()
  const { id } = useParams()
  const user = useUser()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_public: false,
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [search, setSearch] = useState("")
  const [movies, setMovies] = useState<any[]>([])
  const [selected, setSelected] = useState<any[]>([])
  const [error, setError] = useState("")
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState("")

  // 🔁 Cargar la watchlist y películas asociadas
  useEffect(() => {
    const fetchWatchlist = async () => {
      const res = await fetch(`/api/watchlists/${id}`)
      const data = await res.json()
      const wl = data.watchlist

      setFormData({
        name: wl.name,
        description: wl.description,
        is_public: wl.is_public,
        tags: wl.tags || [],
      })

      setCoverPreview(wl.cover_url || "")

      setSelected(wl.watchlist_movies?.map((wm: any) => wm.movie) || [])
    }

    fetchWatchlist()
  }, [id])

  const fetchMovies = async (query: string) => {
    const { data } = await supabase
      .from("movies")
      .select("*")
      .ilike("title", `%${query}%`)
      .limit(10)

    setMovies(data || [])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (file) {
      setCoverFile(file)
      setCoverPreview(URL.createObjectURL(file))
    }
  }

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return coverPreview

    const ext = coverFile.name.split(".").pop()
    const filename = `${crypto.randomUUID()}.${ext}`

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("watchlist-covers")
      .upload(filename, coverFile)

    if (uploadError) {
      console.error("Error subiendo portada:", uploadError)
      throw uploadError
    }

    const { data: urlData } = supabase
      .storage
      .from("watchlist-covers")
      .getPublicUrl(uploadData.path)

    return urlData.publicUrl
  }

  const handleUpdate = async () => {
    setError("")

    try {
      const cover_url = await uploadCover()

      const res = await fetch(`/api/watchlists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cover_url,
          movie_ids: selected.map((m) => m.id),
        }),
      })

      const { error: patchError } = await res.json()

      if (!res.ok || patchError) {
        setError("Error al actualizar la lista")
        return
      }

      router.push(`/watchlists/${id}`)
    } catch (e) {
      console.error(e)
      setError("Error inesperado al actualizar")
    }
  }

  return (
    <div className="container py-8 max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Editar lista</h1>
        <Button onClick={handleUpdate}>
          <Save className="h-4 w-4 mr-2" /> Guardar cambios
        </Button>
      </div>

      {/* Cover Image Upload */}
      <Card>
        <CardHeader><CardTitle>Imagen de portada</CardTitle></CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {coverPreview ? (
            <Image
              src={coverPreview}
              alt="Preview"
              width={600}
              height={300}
              className="rounded-lg object-cover"
            />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader><CardTitle>Información</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nombre *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <Label>Descripción</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <Label>Visibilidad</Label>
            <RadioGroup
              value={formData.is_public ? "public" : "private"}
              onValueChange={(v) =>
                setFormData({ ...formData, is_public: v === "public" })
              }
              className="mt-2 space-y-2"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="private" id="r1" />
                <Label htmlFor="r1" className="flex items-center gap-1">
                  <Lock className="h-4 w-4" /> Privada
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="public" id="r2" />
                <Label htmlFor="r2" className="flex items-center gap-1">
                  <Globe className="h-4 w-4" /> Pública
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label>Etiquetas</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() =>
                      setFormData({
                        ...formData,
                        tags: formData.tags.filter((t) => t !== tag),
                      })
                    }
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {formData.tags.length < 5 && (
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (e.preventDefault(),
                      setFormData({
                        ...formData,
                        tags: [...formData.tags, newTag.trim()],
                      }),
                      setNewTag(""))
                  }
                  placeholder="Añadir etiqueta"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (newTag.trim()) {
                      setFormData({
                        ...formData,
                        tags: [...formData.tags, newTag.trim()],
                      })
                      setNewTag("")
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Movies */}
      <Card>
        <CardHeader><CardTitle>Añadir películas</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="search">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="search">Buscar películas</TabsTrigger>
              <TabsTrigger value="selected">Seleccionadas ({selected.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value)
                    fetchMovies(e.target.value)
                  }}
                  className="pl-8"
                  placeholder="Buscar películas..."
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {movies.map((m) => (
                  <div key={m.id} className="flex gap-4 border p-3 rounded">
                    <div className="w-12 h-16 relative">
                      <Image
                        src={m.image_url || "/placeholder.svg"}
                        alt={m.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{m.title}</h4>
                      <p className="text-sm text-gray-400">{m.year}</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={selected.some((s) => s.id === m.id)}
                      onClick={() => setSelected([...selected, m])}
                    >
                      Añadir
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="selected" className="space-y-3">
              {selected.length === 0 ? (
                <p className="text-gray-400">No has seleccionado ninguna película</p>
              ) : (
                selected.map((m) => (
                  <div key={m.id} className="flex gap-4 border p-3 rounded">
                    <div className="w-12 h-16 relative">
                      <Image
                        src={m.image_url || "/placeholder.svg"}
                        alt={m.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{m.title}</h4>
                      <p className="text-sm text-gray-400">{m.year}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        setSelected(selected.filter((s) => s.id !== m.id))
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}
