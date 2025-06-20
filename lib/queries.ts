import { supabase } from "./supabaseClient"

// Obtener todas las películas ordenadas por año
export async function getAllMovies() {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("release_year", { ascending: false })

  if (error) throw error
  return data
}

// Obtener una película por su ID
export async function getMovieById(id: string) {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

// Obtener películas por género
export async function getMoviesByGenre(genre: string) {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("genre", `%${genre}%`)
    .order("release_year", { ascending: false })

  if (error) throw error
  return data
}

// Obtener reseñas de una película por su ID
export async function getReviewsByMovieId(movieId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("movie_id", movieId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data || []
}

// Obtener películas similares a partir de la tabla de enlaces
export async function getSimilarMovies(movieId: string): Promise<any[]> {
  const { data: links, error: linkError } = await supabase
    .from("similar_movies")
    .select("related_movie_id")
    .eq("movie_id", movieId)

  if (linkError) throw linkError

  const ids = links?.map(l => l.related_movie_id) || []

  if (ids.length === 0) return []

  const { data: movies, error: movieError } = await supabase
    .from("movies")
    .select("*")
    .in("id", ids)

  if (movieError) throw movieError
  return movies || []
}

// Añadir una nueva reseña a una película
export async function addReview({
  movieId,
  userId,
  rating,
  content,
}: {
  movieId: string
  userId: string | null
  rating: number
  content: string
}) {
  const { error } = await supabase.from("reviews").insert([
    {
      movie_id: movieId,
      user_id: userId,
      rating,
      content,
    },
  ])
  if (error) throw error
}
