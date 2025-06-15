import { supabase } from "./supabaseClient"

export async function getAllMovies() {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("release_year", { ascending: false })

  if (error) throw error
  return data
}

export async function getMovieById(id: string) {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function getMoviesByGenre(genre: string) {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("genre", `%${genre}%`)
    .order("release_year", { ascending: false })

  if (error) throw error
  return data
}

export async function getReviewsByMovieId(movieId: string): Promise<any[]> {
  const { data } = await supabase
    .from("reviews")
    .select("*")
    .eq("movie_id", movieId)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getSimilarMovies(movieId: string): Promise<any[]> {
  const { data: links } = await supabase
    .from("similar_movies")
    .select("related_movie_id")
    .eq("movie_id", movieId)

  const ids = links?.map(l => l.related_movie_id) || []

  if (ids.length === 0) return []

  const { data: movies } = await supabase
    .from("movies")
    .select("*")
    .in("id", ids)

  return movies || []
}

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
