"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // use sus Tabs de UI

export default function NewWatchlistPage() {
  const router = useRouter()
  const user = useUser()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_public: false,
    tags: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [error, setError] = useState("")

  // búsqueda + listado
  const [search, setSearch] = useState("")
  const [movies, setMovies] = useState<any[]>([])
  const [selected, setSelected] = useState<any[]>([])
  const [loadingList, setLoadingList] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const PAGE_SIZE = 24
  const pageRef = useRef(0)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Cover upload state
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>("")

  // -------- Helpers de carga ----------
  const fetchInitialMovies = async () => {
    setLoadingList(true)
    pageRef.current = 0
    const from = 0
    const to = PAGE_SIZE - 1
    const { data, error, count } = await supabase
      .from("movies")
      .select("id,title,release_year,image_url", { count: "exact" })
      .order("release_year", { ascending: false })
      .range(from, to)

    if (error) {
      console.error(error)
      setMovies([])
      setHasMore(false)
    } else {
      setMovies(data || [])
      setHasMore((count ?? 0) > PAGE_SIZE)
    }
    setLoadingList(false)
  }

  const fetchMoreMovies = async () => {
    if (loadingList || !hasMore) return
    setLoadingList(true)
    pageRef.current += 1
    const from = pageRef.current * PAGE_SIZE
    const to = from + PAGE_SIZE - 1

    // Si hay búsqueda activa, continuamos esa búsqueda
    let query = supabase
      .from("movies")
      .select("id,title,release_year,image_url")
      .order("release_year", { ascending: false })
      .range(from, to)

    if (search.trim() !== "") {
      query = supabase
        .from("movies")
        .select("id,title,release_year,image_url")
        .ilike("title", `%${search.trim()}%`)
        .order("release_year", { ascending: false })
        .range(from, to)
    }

    const { data, error } = await query
    if (error) {
      console.error(error)
    } else {
      setMovies((prev) => [...prev, ...(data || [])])
      if (!data || data.length < PAGE_SIZE) setHasMore(false)
    }
    setLoadingList(false)
  }

  const fetchMoviesBySearch = async (q: string) => {
    setLoadingList(true)
    pageRef.current = 0
    const from = 0
    const to = PAGE_SIZE - 1

    // si la búsqueda está vacía, mostrar lista inicial completa (ordenada)
    if (q.trim() === "") {
      await fetchInitialMovies()
      return
    }

    const { data, error, count } = await supabase
      .from("movies")
      .select("id,title,release_year,image_url", { count: "exact" })
      .ilike("title", `%${q}%`)
      .order("release_year", { ascending: false })
      .range(from, to)

    if (error) {
      console.error(error)
      setMovies([])
      setHasMore(false)
    } else {
      setMovies(data || [])
      setHasMore((count ?? 0) > PAGE_SIZE)
    }
    setLoadingList(false)
  }

  // cargar al entrar
  useEffect(() => {
    fetchInitialMovies()
  }, [])

  // debounce de búsqueda
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      fetchMoviesBySearch(search)
    }, 350)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // -------- Cover upload ----------
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    const MAX_MB = 6
    if (!file.type.startsWith("image/")) return alert("El archivo debe ser una imagen.")
    if (file.size > MAX_MB * 1024 * 1024) return alert(`La imagen no puede superar ${MAX_MB} MB.`)
    if (coverPreview) URL.revokeObjectURL(coverPreview)
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const uploadCover = async (): Promise<string | null> => {
    if (!coverFile) return null
    const ext = coverFile.name.split(".").pop() || "jpg"
    const filename = `${crypto.randomUUID()}.${ext.toLowerCase()}`
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from("watchlist-covers")
      .upload(filename, coverFile, {
        cacheControl: "3600",
        upsert: false,
      })
    if (uploadError) {
      console.error(uploadError)
      return null
    }
    const { data: urlData } = supabase.storage.from("watchlist-covers").getPublicUrl(uploadData.path)
    return urlData.publicUrl
  }

  const handleCreate = async () => {
    if (!user?.id) {
      setError("Debes iniciar sesión para crear una lista.")
      return
    }
    if (!formData.name.trim()) {
      setError("El nombre es obligatorio")
      return
    }
    setError("")
    try {
      const cover_url = await uploadCover()
      const res = await fetch("/api/watchlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          is_public: formData.is_public,
          movie_ids: selected.map((m) => m.id),
          cover_url,
        }),
      })
      const { watchlist, error: apiError } = await res.json()
      if (!res.ok || apiError) {
        setError("Error al crear la lista")
        return
      }
      router.push(`/watchlists/${watchlist.id}`)
    } catch (e) {
      console.error(e)
      setError("Error inesperado al crear la lista")
    }
  }

  return (
    <div className="container py-8 max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Crear nueva lista</h1>
        <Button onClick={handleCreate}>
          <Save className="h-4 w-4 mr-2" /> Crear lista
        </Button>
      </div>

      {/* Cover Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Imagen de portada</CardTitle>
        </CardHeader>
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
          <input type="file" accept="image/*" onChange={handleFileChange} className="block" />
        </CardContent>
      </Card>

      {/* Info */}
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
                      setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
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
                    setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] }),
                    setNewTag(""))
                  }
                  placeholder="Añadir etiqueta"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    if (newTag.trim()) {
                      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
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

      {/* Add Movies */}
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
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                  placeholder="Buscar películas..."
                />
              </div>

              {/* listamos SIEMPRE, con o sin búsqueda */}
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
                      <p className="text-sm text-gray-400">{m.release_year ?? ""}</p>
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

              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={fetchMoreMovies}
                  disabled={loadingList || !hasMore}
                >
                  {loadingList ? "Cargando..." : hasMore ? "Cargar más" : "No hay más resultados"}
                </Button>
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
                      <p className="text-sm text-gray-400">{m.release_year ?? ""}</p>
                    </div>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => setSelected(selected.filter((s) => s.id !== m.id))}
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
