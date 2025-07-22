'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function EditMoviePage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [movie, setMovie] = useState<any>(null)

  useEffect(() => {
    const fetchMovie = async () => {
      const { data, error } = await supabase.from('movies').select('*').eq('id', id).single()
      if (error) {
        alert('Error al cargar la película')
        console.error(error)
      } else {
        setMovie(data)
      }
      setLoading(false)
    }

    if (id) fetchMovie()
  }, [id])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setMovie((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    const { error } = await supabase
      .from('movies')
      .update({
        title: movie.title,
        original_title: movie.original_title,
        release_year: parseInt(movie.release_year),
        duration: movie.duration,
        genre: movie.genre,
        description: movie.description,
        image_url: movie.image_url,
        backdrop_url: movie.backdrop_url,
        rating: parseFloat(movie.rating),
        director: movie.director,
        cast: movie.cast,
      })
      .eq('id', id)

    if (error) {
      alert('Error al guardar los cambios')
      console.error(error)
    } else {
      alert('Película actualizada correctamente')
      router.push('/admin/edit-movie')
    }
  }

  if (loading) return <p className="p-4">Cargando...</p>
  if (!movie) return <p className="p-4 text-red-500">Película no encontrada</p>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Editar película</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input id="title" name="title" value={movie.title} onChange={handleChange} required />
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
        <div>
          <Label htmlFor="image_url">Imagen (cartel)</Label>
          <Input id="image_url" name="image_url" value={movie.image_url || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="backdrop_url">Imagen de fondo</Label>
          <Input id="backdrop_url" name="backdrop_url" value={movie.backdrop_url || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="rating">Valoración</Label>
          <Input id="rating" name="rating" type="number" step="0.1" value={movie.rating || ''} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="director">Director</Label>
          <Input id="director" name="director" value={movie.director || ''} onChange={handleChange} />
        </div>

        <Button type="submit" className="mt-4">
          Guardar cambios
        </Button>
      </form>
    </div>
  )
}
