'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function NewMoviePage() {
  const [title, setTitle] = useState('')
  const [originalTitle, setOriginalTitle] = useState('')
  const [releaseYear, setReleaseYear] = useState('')
  const [duration, setDuration] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')     // se autocompletará tras subir cartel
  const [backdropUrl, setBackdropUrl] = useState('') // se autocompletará tras subir fondo
  const [rating, setRating] = useState('')
  const [director, setDirector] = useState('')
  const [cast, setCast] = useState('')
  const [similarMovies, setSimilarMovies] = useState<string[]>([])
  const [allMovies, setAllMovies] = useState<any[]>([])

  // Estados de subida/preview
  const [posterFile, setPosterFile] = useState<File | null>(null)
  const [posterPreview, setPosterPreview] = useState('')
  const [isUploadingPoster, setIsUploadingPoster] = useState(false)

  const [backdropFile, setBackdropFile] = useState<File | null>(null)
  const [backdropPreview, setBackdropPreview] = useState('')
  const [isUploadingBackdrop, setIsUploadingBackdrop] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await supabase.from('movies').select('id, title')
      setAllMovies(data || [])
    }
    fetchMovies()
  }, [])

  // -------- Handlers cartel --------
  const handlePosterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    const MAX_MB = 5
    if (!file.type.startsWith('image/')) return alert('El cartel debe ser una imagen.')
    if (file.size > MAX_MB * 1024 * 1024) return alert(`El cartel no puede superar ${MAX_MB} MB.`)
    if (posterPreview) URL.revokeObjectURL(posterPreview)
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

      // Bucket público:
      const { data: urlData } = supabase.storage.from('movies').getPublicUrl(data.path)
      return urlData.publicUrl

      // Bucket privado: 
      // const { data: signed } = await supabase.storage.from('movies').createSignedUrl(data.path, 60 * 60)
      // return signed?.signedUrl ?? null
    } finally {
      setIsUploadingPoster(false)
    }
  }

  // -------- Handlers fondo --------
  const handleBackdropChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    const MAX_MB = 8
    if (!file.type.startsWith('image/')) return alert('El fondo debe ser una imagen.')
    if (file.size > MAX_MB * 1024 * 1024) return alert(`El fondo no puede superar ${MAX_MB} MB.`)
    if (backdropPreview) URL.revokeObjectURL(backdropPreview)
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

      // Bucket privado:
      // const { data: signed } = await supabase.storage.from('movies').createSignedUrl(data.path, 60 * 60)
      // return signed?.signedUrl ?? null
    } finally {
      setIsUploadingBackdrop(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 1) Subir imágenes si hay archivos seleccionados
    let finalPosterUrl = imageUrl
    let finalBackdropUrl = backdropUrl

    if (posterFile) {
      const u = await uploadPoster()
      if (!u) return
      finalPosterUrl = u
      setImageUrl(u)
    }
    if (backdropFile) {
      const u = await uploadBackdrop()
      if (!u) return
      finalBackdropUrl = u
      setBackdropUrl(u)
    }

    // 2) Normalizar cast
    const castArray = cast
      .split('\n')
      .map((line) => {
        const [name, character] = line.split(' as ')
        return { name: name?.trim(), character: character?.trim() }
      })
      .filter((c) => c.name && c.character)

    // 3) Insertar película
    const { data, error } = await supabase
      .from('movies')
      .insert([{
        title,
        original_title: originalTitle,
        release_year: releaseYear ? parseInt(releaseYear) : null,
        duration,
        genre,
        description,
        image_url: finalPosterUrl || null,
        backdrop_url: finalBackdropUrl || null,
        rating: rating ? parseFloat(rating) : null,
        director,
        cast: castArray,
      }])
      .select()
      .single()

    if (error) {
      alert('Error al crear película')
      console.error(error)
      return
    }

    // 4) Relacionar similares
    if (similarMovies.length > 0) {
      const relations = similarMovies.map((id) => ({
        movie_id: data.id,
        related_movie_id: id,
      }))
      const { error: simError } = await supabase.from('similar_movies').insert(relations)
      if (simError) {
        alert('Película creada, pero error al asociar similares')
        console.error(simError)
      }
    }

    // Limpieza de previews temporales
    if (posterPreview) URL.revokeObjectURL(posterPreview)
    if (backdropPreview) URL.revokeObjectURL(backdropPreview)

    alert('Película creada con éxito')
    router.push('/movies')
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Nueva película</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Datos básicos */}
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="originalTitle">Título original</Label>
          <Input id="originalTitle" value={originalTitle} onChange={(e) => setOriginalTitle(e.target.value)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="releaseYear">Año</Label>
            <Input id="releaseYear" value={releaseYear} onChange={(e) => setReleaseYear(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="duration">Duración</Label>
            <Input id="duration" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="genre">Género</Label>
          <Input id="genre" value={genre} onChange={(e) => setGenre(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="description">Sinopsis</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        {/* Subida de cartel */}
        <div className="space-y-2">
          <Label>Cartel</Label>
          {posterPreview || imageUrl ? (
            <img
              src={posterPreview || imageUrl}
              alt="Poster preview"
              className="w-full max-h-64 object-cover rounded border"
            />
          ) : null}
          <div className="flex gap-2">
            <Input type="file" accept="image/*" onChange={handlePosterChange} />
            <Button type="button" onClick={async () => {
              if (!posterFile) return alert('Seleccione un archivo primero.')
              const u = await uploadPoster()
              if (u) setImageUrl(u)
            }} disabled={isUploadingPoster}>
              {isUploadingPoster ? 'Subiendo...' : 'Subir cartel'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">O pegue una URL directa:</p>
          <Input placeholder="https://..." value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>

        {/* Subida de fondo */}
        <div className="space-y-2">
          <Label>Imagen de fondo</Label>
          {backdropPreview || backdropUrl ? (
            <img
              src={backdropPreview || backdropUrl}
              alt="Backdrop preview"
              className="w-full max-h-64 object-cover rounded border"
            />
          ) : null}
          <div className="flex gap-2">
            <Input type="file" accept="image/*" onChange={handleBackdropChange} />
            <Button type="button" onClick={async () => {
              if (!backdropFile) return alert('Seleccione un archivo primero.')
              const u = await uploadBackdrop()
              if (u) setBackdropUrl(u)
            }} disabled={isUploadingBackdrop}>
              {isUploadingBackdrop ? 'Subiendo...' : 'Subir fondo'}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">O pegue una URL directa:</p>
          <Input placeholder="https://..." value={backdropUrl} onChange={(e) => setBackdropUrl(e.target.value)} />
        </div>

        {/* Resto */}
        <div>
          <Label htmlFor="rating">Valoración</Label>
          <Input id="rating" type="number" step="0.1" value={rating} onChange={(e) => setRating(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="director">Director</Label>
          <Input id="director" value={director} onChange={(e) => setDirector(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="cast">Reparto</Label>
          <Textarea
            id="cast"
            value={cast}
            onChange={(e) => setCast(e.target.value)}
            placeholder="Ejemplo: Timothée Chalamet as Paul Atreides"
          />
        </div>

        {/* Películas similares */}
        <div>
          <Label htmlFor="similar">Películas similares</Label>
          <select
            id="similar"
            multiple
            value={similarMovies}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions, (option) => option.value)
              setSimilarMovies(selected)
            }}
            className="w-full h-40 border rounded-md p-2 bg-background text-foreground"
          >
            {allMovies.map((movie) => (
              <option key={movie.id} value={movie.id}>
                {movie.title}
              </option>
            ))}
          </select>
          <p className="text-sm text-muted-foreground mt-1">
            Use Ctrl (Windows) o Cmd (Mac) para seleccionar varias.
          </p>
        </div>

        <Button type="submit" className="mt-4" disabled={isUploadingPoster || isUploadingBackdrop}>
          Crear película
        </Button>
      </form>
    </div>
  )
}
