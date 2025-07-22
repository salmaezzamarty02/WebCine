'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function AdminMovieListPage() {
  const [movies, setMovies] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchMovies = async () => {
      const { data } = await supabase.from('movies').select('*')
      setMovies(data || [])
    }
    fetchMovies()
  }, [])

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Editar películas</h1>
        <Button onClick={() => router.push('/admin/new-movie')}>Nueva película</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="border rounded-lg p-3 shadow-sm bg-card hover:shadow-md transition"
          >
            <img src={movie.image_url} alt={movie.title} className="w-full h-auto rounded mb-2" />
            <h3 className="font-semibold text-sm truncate">{movie.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{movie.release_year}</p>

            <div className="flex gap-2">
              <Button size="sm" onClick={() => router.push(`/admin/edit-movie/${movie.id}`)}>
                Editar
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  const confirmed = confirm(`¿Seguro que quieres eliminar "${movie.title}"?`)
                  if (!confirmed) return

                  const { error } = await supabase.from('movies').delete().eq('id', movie.id)
                  if (error) {
                    alert('Error al eliminar la película')
                    console.error(error)
                  } else {
                    alert('Película eliminada correctamente')
                    setMovies((prev) => prev.filter((m) => m.id !== movie.id))
                  }
                }}
              >
                Eliminar
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
