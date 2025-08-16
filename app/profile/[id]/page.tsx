// app/profile/[id]/page.tsx
import { createClient } from "@/lib/supabaseServer"
import ProfileClient from "./ProfileClient"

export const dynamic = "force-dynamic"

// Tipos auxiliares
type MovieMini = {
  id: string
  title: string
  release_year: number
  image_url: string | null
}

type ReviewRow = {
  created_at: string
  rating: number
  content: string | null
  movie: MovieMini | null
}

type WatchedRow = {
  watched_at: string
  movie: MovieMini | null
}

type WatchlistMovieRow =
  | { movies: MovieMini | null }
  | { movies: MovieMini[] | null }

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const userId = params.id

  // Perfil
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single()

  if (profileError || !profile) {
    return <div className="p-6 text-center">Usuario no encontrado.</div>
  }

  // Películas vistas (count)
  const { count: moviesWatched = 0 } = await supabase
    .from("watched_movies")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Reseñas (count)
  const { count: reviewsCount = 0 } = await supabase
    .from("reviews")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)

  // Listas del usuario
  const { data: watchlistsRaw } = await supabase
    .from("watchlists")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  const watchlists = watchlistsRaw ?? []

  // === Amigos (vía RPC para bypasear RLS)
  type AcceptedFriendshipRow = { friendship_id: string; friend_id: string }

  const { data: acceptedRows, error: frErr } = await supabase
    .rpc("get_user_accepted_friendships", { p_user: userId })

  if (frErr) {
    console.warn("get_user_accepted_friendships error:", frErr.message)
  }

  const rows = (acceptedRows ?? []) as AcceptedFriendshipRow[]
  const friendIdsArr = Array.from(new Set(rows.map(r => r.friend_id)))
  const friendsCount = friendIdsArr.length

  // Perfiles de amigos (para el tab)
  let friendsList: Array<{
    id: string
    name: string | null
    username: string | null
    avatar: string | null
    moviesWatched: number
    isFollowing: boolean
  }> = []

  if (friendIdsArr.length > 0) {
    const { data: friendProfiles, error: fpErr } = await supabase
      .from("profiles")
      .select("id, name, username, avatar")
      .in("id", friendIdsArr)

    if (fpErr) {
      console.warn("profiles for friends error:", fpErr.message)
    } else {
      friendsList = (friendProfiles ?? []).map(p => ({
        id: p.id,
        name: p.name,
        username: p.username,
        avatar: p.avatar,
        moviesWatched: 0,  // calcule si lo desea más adelante
        isFollowing: true, // amistad aceptada => relación mutua
      }))
    }
  }

  // ===== Última reseña (fila única)
  const { data: lastReviewRowRaw } = await supabase
    .from("reviews")
    .select("created_at, rating, content, movie:movies(id, title, release_year, image_url)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const lastReviewRow = (lastReviewRowRaw ?? null) as ReviewRow | null

  // ===== Última película vista (usar watched_at según su tabla)
  const { data: lastWatchedRowRaw } = await supabase
    .from("watched_movies")
    .select("watched_at, movie:movies(id, title, release_year, image_url)")
    .eq("user_id", userId)
    .order("watched_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const lastWatchedRow = (lastWatchedRowRaw ?? null) as WatchedRow | null

  // ===== Películas vistas (listado completo para el tab)
  type WatchedMovieRow = { watched_at: string; movie: MovieMini | null }

  const { data: watchedRowsRaw } = await supabase
    .from("watched_movies")
    .select("watched_at, movie:movies(id, title, release_year, image_url)")
    .eq("user_id", userId)
    .order("watched_at", { ascending: false })
    .limit(60)

  const watchedMovies = (watchedRowsRaw ?? [])
    .map((row: WatchedMovieRow) => row.movie)
    .filter((m): m is MovieMini => !!m)
    .map((m) => ({
      id: m.id,
      title: m.title,
      year: m.release_year,
      poster: m.image_url,
    }))

  // Última lista creada + muestra de películas
  const latestWatchlist = watchlists.length > 0 ? watchlists[0] : null

  let wlMoviesSample: MovieMini[] = []
  if (latestWatchlist) {
    const { data: wlRowsRaw } = await supabase
      .from("watchlist_movies")
      .select(`movies:movie_id ( id, title, release_year, image_url )`)
      .eq("watchlist_id", latestWatchlist.id)
      .limit(5)

    const wlRows = (wlRowsRaw ?? []) as WatchlistMovieRow[]

    for (const row of wlRows) {
      const m = (row as any).movies
      if (!m) continue
      if (Array.isArray(m)) {
        for (const mm of m) {
          if (mm) wlMoviesSample.push(mm)
        }
      } else {
        wlMoviesSample.push(m as MovieMini)
      }
    }
  }

  // Actividad (3 tarjetas)
  const lastReview = lastReviewRow
    ? {
        id: `review-${lastReviewRow.created_at}`,
        type: "review" as const,
        date: new Date(lastReviewRow.created_at).toLocaleDateString("es-ES"),
        rating: lastReviewRow.rating,
        content: lastReviewRow.content,
        movie: lastReviewRow.movie
          ? {
              id: lastReviewRow.movie.id,
              title: lastReviewRow.movie.title,
              year: lastReviewRow.movie.release_year,
              poster: lastReviewRow.movie.image_url,
            }
          : null,
      }
    : null

  const lastWatched = lastWatchedRow
    ? {
        id: `watched-${lastWatchedRow.watched_at}`,
        type: "watched" as const,
        date: new Date(lastWatchedRow.watched_at).toLocaleDateString("es-ES"),
        movie: lastWatchedRow.movie
          ? {
              id: lastWatchedRow.movie.id,
              title: lastWatchedRow.movie.title,
              year: lastWatchedRow.movie.release_year,
              poster: lastWatchedRow.movie.image_url,
            }
          : null,
      }
    : null

  const lastList = latestWatchlist
    ? {
        id: `list-${latestWatchlist.id}`,
        type: "list" as const,
        date: new Date(latestWatchlist.created_at).toLocaleDateString("es-ES"),
        list: { id: latestWatchlist.id, title: latestWatchlist.name },
        movies: wlMoviesSample.map(m => ({
          id: m.id,
          title: m.title,
          year: m.release_year,
          poster: m.image_url,
        })),
      }
    : null

  const recentActivity = [lastReview, lastWatched, lastList].filter(Boolean)

  const stats = {
    moviesWatched,
    reviews: reviewsCount,
    lists: watchlists.length,
    friends: friendsCount,
  }

  // Pasamos las vistas como watchedMovies y también como favoriteMovies para mantener el cliente actual
  const fullProfile = {
    ...profile,
    stats,
    recentActivity,
    favoriteMovies: watchedMovies, // <- su ProfileClient actual usa favoriteMovies
    watchedMovies,                 // <- por si luego cambia el cliente a este nombre
    watchlists,
    friends: friendsList,
  }

  return <ProfileClient profile={fullProfile} />
}
