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
  const [imageUrl, setImageUrl] = useState('')
  const [backdropUrl, setBackdropUrl] = useState('')
  const [rating, setRating] = useState('')
  const [director, setDirector] = useState('')
  const [cast, setCast] = useState('')
  const [similarMovies, setSimilarMovies] = useState<string[]>([])

  const [allMovies, setAllMovies] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await supabase.from('movies').select('id, title')
      setAllMovies(data || [])
    }
    fetchMovies()
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const castArray = cast
      .split('\n')
      .map((line) => {
        const [name, character] = line.split(' as ')
        return { name: name?.trim(), character: character?.trim() }
      })
      .filter((c) => c.name && c.character)

    const { data, error } = await supabase
      .from('movies')
      .insert([
        {
          title,
          original_title: originalTitle,
          release_year: parseInt(releaseYear),
          duration,
          genre,
          description,
          image_url: imageUrl,
          backdrop_url: backdropUrl,
          rating: parseFloat(rating),
          director,
          cast: castArray,
        },
      ])
      .select()
      .single()

    if (error) {
      alert('Error al crear película')
      console.error(error)
      return
    }

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

    alert('Película creada con éxito')
    router.push('/movies')
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Nueva película</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div>
          <Label htmlFor="imageUrl">Imagen (cartel)</Label>
          <Input id="imageUrl" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="backdropUrl">Imagen de fondo</Label>
          <Input id="backdropUrl" value={backdropUrl} onChange={(e) => setBackdropUrl(e.target.value)} />
        </div>
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

        {/* 🔽 Películas similares como desplegable múltiple */}
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
            Usa Ctrl (Windows) o Cmd (Mac) para seleccionar varias.
          </p>
        </div>

        <Button type="submit" className="mt-4">
          Crear película
        </Button>
      </form>
    </div>
  )
}
