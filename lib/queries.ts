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
export async function getReviewsByMovieId(movieId: string) {
  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id,
      content,
      rating,
      created_at,
      user_id,
      profiles (
        id,
        username,
        avatar
      )
    `)
    .eq("movie_id", movieId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("❌ Error obteniendo reseñas:", error.message)
    return []
  }

  return data
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

// ✅ Añadir una nueva reseña a una película (actualizado)
export async function addReview({
  movie_id,
  content,
  rating,
  user_id
}: {
  movie_id: string
  content: string
  rating: number
  user_id: string
}) {
  const { data, error } = await supabase.from("reviews").insert({
    movie_id,
    content,
    rating,
    user_id
  })

  if (error) {
    console.error("❌ Error al insertar reseña:", error.message)
    throw error
  }

  return data
}

// Obtener todas las listas de seguimiento del usuario
export async function getUserWatchlists(userId: string) {
  const { data, error } = await supabase
    .from("watchlists")
    .select(`
      *,
      user:users (
        id,
        name,
        avatar
      )
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("❌ Error obteniendo listas de seguimiento:", error.message)
    throw error
  }
  return data || []
}

// Obtener una lista de seguimiento por su ID
export async function getWatchlistById(watchlistId: string) {
  const { data, error } = await supabase
    .from("watchlists")
    .select("*")
    .eq("id", watchlistId)
    .single()

  if (error) {
    console.error("❌ Error obteniendo watchlist:", error.message)
    throw error
  }

  return data
}
// Añadir una película a una lista de seguimiento

export async function addMovieToWatchlist({
  watchlistId,
  movieId
}: {
  watchlistId: string
  movieId: string
}) {
  const { data, error } = await supabase.from("watchlist_movies").insert({
    watchlist_id: watchlistId,
    movie_id: movieId
  })

  if (error) {
    console.error("❌ Error al añadir película a la lista de seguimiento:", error.message)
    throw error
  }

  return data
}