'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function EditMoviePage() {
  const params = useParams() as { id: string }
  const id = params?.id
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [movie, setMovie] = useState<any>(null)

  // Estados de subida/preview
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState<string>('')
  const [isUploadingPoster, setIsUploadingPoster] = useState(false)

  const [backdropFile, setBackdropFile] = useState<File | null>(null)
  const [backdropPreview, setBackdropPreview] = useState<string>('')
  const [isUploadingBackdrop, setIsUploadingBackdrop] = useState(false)

  useEffect(() => {
    const fetchMovie = async () => {
      const { data, error } = await supabase.from('movies').select('*').eq('id', id).single()
      if (error) {
        alert('Error al cargar la película')
        console.error(error)
      } else {
        setMovie(data)
        // precargar previews con las URLs existentes
        setPosterPreview(data?.image_url || '')
        setBackdropPreview(data?.backdrop_url || '')
      }
      setLoading(false)
    }
    if (id) fetchMovie()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMovie((prev: any) => ({ ...prev, [name]: value }))
  }

  // ---- Handlers cartel ----
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    const MAX_MB = 5
    if (!file.type.startsWith('image/')) return alert('El cartel debe ser una imagen.')
    if (file.size > MAX_MB * 1024 * 1024) return alert(`El cartel no puede superar ${MAX_MB} MB.`)
    if (posterPreview && posterPreview.startsWith('blob:')) URL.revokeObjectURL(posterPreview)
    setPosterFile(file)
    setPosterPreview(URL.createObjectURL(file))
  }

  const uploadPoster = async (): Promise<string | null> => {
    if (!posterFile) return null
    setIsUploadingPoster(true)
    try {
      const ext = posterFile.name.split('.').pop() || 'jpg'
      const filename = `${crypto.randomUUID()}.${ext.toLowerCase()}`
      const path = `posters/${filename}`

      const { data, error } = await supabase.storage
        .from('movies')
        .upload(path, posterFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: posterFile.type || 'image/*',
        })
      if (error) {
        console.error(error)
        alert('No se pudo subir el cartel.')
        return null
      }
      const { data: urlData } = supabase.storage.from('movies').getPublicUrl(data.path)
      return urlData.publicUrl
    } finally {
      setIsUploadingPoster(false)
    }
  }

  // ---- Handlers fondo ----
  const handleBackdropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    const MAX_MB = 8
    if (!file.type.startsWith('image/')) return alert('El fondo debe ser una imagen.')
    if (file.size > MAX_MB * 1024 * 1024) return alert(`El fondo no puede superar ${MAX_MB} MB.`)
    if (backdropPreview && backdropPreview.startsWith('blob:')) URL.revokeObjectURL(backdropPreview)
    setBackdropFile(file)
    setBackdropPreview(URL.createObjectURL(file))
  }

  const uploadBackdrop = async (): Promise<string | null> => {
    if (!backdropFile) return null
    setIsUploadingBackdrop(true)
    try {
      const ext = backdropFile.name.split('.').pop() || 'jpg'
      const filename = `${crypto.randomUUID()}.${ext.toLowerCase()}`
      const path = `backdrops/${filename}`

      const { data, error } = await supabase.storage
        .from('movies')
        .upload(path, backdropFile, {
          cacheControl: '3600',
          upsert: false,
          contentType: backdropFile.type || 'image/*',
        })
      if (error) {
        console.error(error)
        alert('No se pudo subir la imagen de fondo.')
        return null
      }
      const { data: urlData } = supabase.storage.from('movies').getPublicUrl(data.path)
      return urlData.publicUrl
    } finally {
      setIsUploadingBackdrop(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1) Si hay archivos nuevos, subirlos y sustituir URLs
    let finalPosterUrl = movie.image_url || ''
    let finalBackdropUrl = movie.backdrop_url || ''

    if (posterFile) {
      const u = await uploadPoster()
      if (!u) return
      finalPosterUrl = u
    }
    if (backdropFile) {
      const u = await uploadBackdrop()
      if (!u) return
      finalBackdropUrl = u
    }

    // 2) Actualizar la película
    const { error } = await supabase
      .from('movies')
      .update({
        title: movie.title,
        original_title: movie.original_title,
        release_year: movie.release_year ? parseInt(movie.release_year) : null,
        duration: movie.duration,
        genre: movie.genre,
        description: movie.description,
        image_url: finalPosterUrl || null,
        backdrop_url: finalBackdropUrl || null,
        rating: movie.rating ? parseFloat(movie.rating) : null,
        director: movie.director,
        cast: movie.cast, // si es JSON/array asegúrese de que mantiene el tipo correcto
      })
      .eq('id', id)

    if (error) {
      alert('Error al guardar los cambios')
      console.error(error)
    } else {
      // liberar blobs temporales
      if (posterPreview?.startsWith('blob:')) URL.revokeObjectURL(posterPreview)
      if (backdropPreview?.startsWith('blob:')) URL.revokeObjectURL(backdropPreview)

      alert('Película actualizada correctamente')
      router.push('/admin/edit-movie')
    }
  }

  if (loading) return <p className="p-4">Cargando...</p>
  if (!movie) return <p className="p-4 text-red-500">Película no encontrada</p>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Editar película</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" value={movie.title || ''} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="original_title">Título original</Label>
          <Input id="original_title" name="original_title" value={movie.original_title || ''} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="release_year">Año</Label>
            <Input id="release_year" name="release_year" value={movie.release_year || ''} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="duration">Duración</Label>
            <Input id="duration" name="duration" value={movie.duration || ''} onChange={handleChange} />
          </div>
        </div>

        <div>
          <Label htmlFor="genre">Género</Label>
          <Input id="genre" name="genre" value={movie.genre || ''} onChange={handleChange} />
        </div>

        <div>
          <Label htmlFor="description">Sinopsis</Label>
          <Textarea id="description" name="description" value={movie.description || ''} onChange={handleChange} />
        </div>

        {/* Cartel: preview + file + URL directa */}
        <div className="space-y-2">
          <Label>Imagen (cartel)</Label>
          {posterPreview ? (
            <img
              src={posterPreview}
              alt="Poster preview"
              className="w-full max-h-64 object-cover rounded border"
            />
          ) : null}
          <div className="flex gap-2">
            <Input type="file" accept="image/*" onChange={handlePosterChange} />
            <Button
              type="button"
              onClick={async () => {
                if (!posterFile) return alert('Seleccione un archivo primero.')
                const u = await uploadPoster()
                if (u) {
                  setMovie((m: any) => ({ ...m, image_url: u }))
                  setPosterPreview(u)
                }
              }}
              disabled={isUploadingPoster}
            >
              {isUploadingPoster ? 'Subiendo...' : 'Subir cartel'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">O pegue una URL directa:</p>
          <Input
            id="image_url"
            name="image_url"
            placeholder="https://..."
            value={movie.image_url || ''}
            onChange={(e) => {
              setMovie((m: any) => ({ ...m, image_url: e.target.value }))
              setPosterPreview(e.target.value || '')
            }}
          />
        </div>

        {/* Fondo: preview + file + URL directa */}
        <div className="space-y-2">
          <Label>Imagen de fondo</Label>
          {backdropPreview ? (
            <img
              src={backdropPreview}
              alt="Backdrop preview"
              className="w-full max-h-64 object-cover rounded border"
            />
          ) : null}
          <div className="flex gap-2">
            <Input type="file" accept="image/*" onChange={handleBackdropChange} />
            <Button
              type="button"
              onClick={async () => {
                if (!backdropFile) return alert('Seleccione un archivo primero.')
                const u = await uploadBackdrop()
                if (u) {
                  setMovie((m: any) => ({ ...m, backdrop_url: u }))
                  setBackdropPreview(u)
                }
              }}
              disabled={isUploadingBackdrop}
            >
              {isUploadingBackdrop ? 'Subiendo...' : 'Subir fondo'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">O pegue una URL directa:</p>
          <Input
            id="backdrop_url"
            name="backdrop_url"
            placeholder="https://..."
            value={movie.backdrop_url || ''}
            onChange={(e) => {
              setMovie((m: any) => ({ ...m, backdrop_url: e.target.value }))
              setBackdropPreview(e.target.value || '')
            }}
          />
        </div>

        <div>
          <Label htmlFor="rating">Valoración</Label>
          <Input id="rating" name="rating" type="number" step="0.1" value={movie.rating ?? ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="director">Director</Label>
          <Input id="director" name="director" value={movie.director || ''} onChange={handleChange} />
        </div>

        <Button type="submit" className="mt-4" disabled={isUploadingPoster || isUploadingBackdrop}>
          Guardar cambios
        </Button>
      </form>
    </div>
  )
}
