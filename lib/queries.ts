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
    .ilike("genres", `%${genre}%`)
    .order("release_year", { ascending: false })

  if (error) throw error
  return data
} 