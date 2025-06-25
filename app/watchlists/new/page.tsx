"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import useUser from "@/lib/useUser"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Save, Plus, X, Lock, Globe, Search, Film } from "lucide-react"
import Image from "next/image"

export default function NewWatchlistPage() {
  const router = useRouter()
  const user = useUser()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_public: false,
    category: "",
    tags: [] as string[],
  })

  const [newTag, setNewTag] = useState("")
  const [search, setSearch] = useState("")
  const [movies, setMovies] = useState<any[]>([])
  const [selected, setSelected] = useState<any[]>([])
  const [error, setError] = useState("")

  const fetchMovies = async (query: string) => {
    const { data } = await supabase
      .from("movies")
      .select("*")
      .ilike("title", `%${query}%`)
      .limit(10)

    setMovies(data || [])
  }

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio")
      return
    }
    setError("")

    const { data: newWatchlist, error: insertError } = await supabase
      .from("watchlists")
      .insert({
        name: formData.name,
        description: formData.description,
        user_id: user?.id,
        is_public: formData.is_public,
      })
      .select()
      .single()

    if (insertError || !newWatchlist) {
      setError("Error al crear la lista")
      return
    }

    // Insertar películas
    const insertMovies = selected.map((m) => ({
      movie_id: m.id,
      watchlist_id: newWatchlist.id,
    }))
    if (insertMovies.length > 0) {
      await supabase.from("watchlist_movies").insert(insertMovies)
    }

    router.push(`/watchlists/${newWatchlist.id}`)
  }

  return (
    <div className="container py-8 max-w-4xl space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Crear nueva lista</h1>
        <Button onClick={handleCreate}>
          <Save className="h-4 w-4 mr-2" />
          Crear lista
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información</CardTitle>
        </CardHeader>
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
              onValueChange={(v) => setFormData({ ...formData, is_public: v === "public" })}
            >
              <div className="flex items-center space-x-2 mt-2">
                <RadioGroupItem value="private" id="r1" />
                <Label htmlFor="r1" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" /> Privada
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="r2" />
                <Label htmlFor="r2" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Pública
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Etiquetas */}
          <div>
            <Label>Etiquetas</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button onClick={() =>
                    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
                  }>
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      setFormData({
                        ...formData,
                        tags: [...formData.tags, newTag.trim()],
                      })
                      setNewTag("")
                    }
                  }}
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

      {/* Películas */}
      <Card>
        <CardHeader>
          <CardTitle>Añadir películas</CardTitle>
        </CardHeader>
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
                {movies.map((movie) => (
                  <div key={movie.id} className="flex gap-4 border p-3 rounded">
                    <div className="w-12 h-16 relative">
                      <Image
                        src={movie.image_url || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{movie.title}</h4>
                      <p className="text-sm text-gray-400">{movie.year}</p>
                    </div>
                    <Button
                      size="sm"
                      disabled={selected.some((m) => m.id === movie.id)}
                      onClick={() => setSelected([...selected, movie])}
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
                selected.map((movie) => (
                  <div key={movie.id} className="flex gap-4 border p-3 rounded">
                    <div className="w-12 h-16 relative">
                      <Image
                        src={movie.image_url || "/placeholder.svg"}
                        alt={movie.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{movie.title}</h4>
                      <p className="text-sm text-gray-400">{movie.year}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() =>
                        setSelected(selected.filter((m) => m.id !== movie.id))
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
