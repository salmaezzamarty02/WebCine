//page/id/page.tsx
import { createClient } from "@/lib/supabaseServer"
import ProfileClient from "./ProfileClient"

export const dynamic = "force-dynamic"

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", params.id)
    .single()

  if (profileError || !profile) {
    return <div className="p-6 text-center">Usuario no encontrado.</div>
  }

  // Contar películas vistas
  const { count: moviesWatched } = await supabase
    .from("watched_movies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", params.id)

  // Contar reseñas
  const { count: reviewsCount } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("user_id", params.id)

  // Obtener listas del usuario
  const { data: watchlists } = await supabase
    .from("watchlists")
    .select("*")
    .eq("user_id", params.id)

  // Obtener películas favoritas (de momento vacío, a preparar si usas sistema de favoritos)
  //const favoriteMovies: any[] = []

  const favoriteMovies: {
    id: string
    title: string
    release_year: number
    image_url: string
    rating?: number
  }[] = []

  // Obtener actividad reciente (últimas películas vistas y reseñas)
  const { data: watched } = await supabase
    .from("watched_movies")
    .select("created_at, movie:movies(id, title, release_year, image_url)")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: reviews } = await supabase
    .from("reviews")
    .select("created_at, rating, content, movie:movies(id, title, release_year, image_url)")
    .eq("user_id", params.id)
    .order("created_at", { ascending: false })
    .limit(10)

  const recentActivity = [
    ...(reviews?.map((r) => ({
      id: `review-${r.created_at}`,
      type: "review",
      date: new Date(r.created_at).toLocaleDateString(),
      rating: r.rating,
      content: r.content,
      movie: {
        id: r.movie?.id,
        title: r.movie?.title,
        year: r.movie?.release_year,
        poster: r.movie?.image_url,
      },
    })) || []),
    ...(watched?.map((w) => ({
      id: `watched-${w.created_at}`,
      type: "watched",
      date: new Date(w.created_at).toLocaleDateString(),
      movie: {
        id: w.movie?.id,
        title: w.movie?.title,
        year: w.movie?.release_year,
        poster: w.movie?.image_url,
      },
    })) || []),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const stats = {
    moviesWatched: moviesWatched || 0,
    reviews: reviewsCount || 0,
    lists: watchlists?.length || 0,
    followers: 0, // placeholder, implementar luego
    following: 0, // placeholder, implementar luego
  }

  const fullProfile = {
    ...profile,
    stats,
    recentActivity,
    favoriteMovies,
    watchlists: watchlists || [],
    friends: [], // placeholder, implementar luego
  }

  return <ProfileClient profile={fullProfile} />
}
