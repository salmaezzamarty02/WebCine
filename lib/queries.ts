import { supabase } from "./supabaseClient"

export interface UserSuggestion {
  id: string
  username: string
  name: string  
  avatar: string | null
  moviesWatched: number
  mutualFriends: number
}

export interface FriendRequest {
  friendshipId: string   // id de la fila en friendships (para update/reject)
  userId: string         // id del solicitante (para perfil, avatar…)
  username: string
  name: string
  avatar: string | null
  moviesWatched: number
}

export type ForumThreadUser = {
  id: string
  username: string | null
  name: string | null
  avatar: string | null
}

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
      ), likes_count, dislikes_count 
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

// Marcar película como vista
export async function markMovieAsWatched({
  userId,
  movieId
}: {
  userId: string
  movieId: string
}) {
  const { data, error } = await supabase.from("watched_movies").insert({
    user_id: userId,
    movie_id: movieId
  })

  if (error) {
    console.error("❌ Error al marcar como vista:", error.message)
    throw error
  }

  return data
}

// Desmarcar película como vista
export async function unmarkMovieAsWatched({
  userId,
  movieId
}: {
  userId: string
  movieId: string
}) {
  const { error } = await supabase
    .from("watched_movies")
    .delete()
    .eq("user_id", userId)
    .eq("movie_id", movieId)

  if (error) {
    console.error("❌ Error al desmarcar como vista:", error.message)
    throw error
  }
}

// Comprobar si la película está marcada como vista por el usuario
export async function isMovieWatchedByUser({
  userId,
  movieId
}: {
  userId: string
  movieId: string
}) {
  const { data, error } = await supabase
    .from("watched_movies")
    .select("id")
    .eq("user_id", userId)
    .eq("movie_id", movieId)
    .maybeSingle()

  if (error) {
    console.error("❌ Error comprobando si la película está vista:", error.message)
    throw error
  }

  return !!data
}

// Incrementa likes de forma atómica en el cliente
export async function incrementReviewLike(reviewId: string, current: number) {
  const { data, error } = await supabase
    .from("reviews")
    .update({ likes_count: current + 1 })
    .eq("id", reviewId)
    .select()
    .single()

  if (error) {
    console.error("Error incrementando like:", error)
    throw error
  }
  return data
}

export async function incrementReviewDislike(reviewId: string, current: number) {
  const { data, error } = await supabase
    .from("reviews")
    .update({ dislikes_count: current + 1 })
    .eq("id", reviewId)
    .select()
    .single()

  if (error) {
    console.error("Error incrementando dislike:", error)
    throw error
  }
  return data
}


export async function deleteReview(reviewId: string) {
  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
  if (error) {
    console.error("Error borrando reseña:", error)
    throw error
  }
  return true
}



// Obtener todas las categorías del foro
export async function getForumCategories() {
  const { data, error } = await supabase
    .from("forum_categories")
    .select("*")
    .order("name", { ascending: true })

  if (error) {
    console.error("❌ Error al obtener categorías del foro:", error.message)
    return []
  }

  return data
}


export async function getThreadById(id: string) {
  const { data, error } = await supabase
    .from("forum_threads")
    .select(`
      id,
      title,
      content,
      created_at,
      category_id,
      forum_categories:forum_categories!forum_threads_category_id_fkey (
        name
      ),
      user:profiles!forum_threads_user_profile_fkey (
        id,
        username,
        avatar,
        created_at
      ),
      forum_comments (
        id,
        content,
        created_at,
        user_id,
        user:profiles!forum_comments_user_profile_fkey (
          id,
          username,
          avatar,
          created_at
        )
      ),
      forum_tags (
        id,
        name
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("❌ Error al obtener hilo:", error.message)
    return null
  }

  return data
}

export async function addForumComment({ thread_id, user_id, content }: {
  thread_id: string
  user_id: string
  content: string
}) {
  const { data, error } = await supabase
    .from('forum_comments')
    .insert({
      thread_id,
      user_id,
      content,
    })

  if (error) throw new Error(error.message)
}

type EventRow = {
  id: string
  title: string
  description: string | null
  date: string // viene como date; lo trataremos como string
  time_range: string | null
  location: string | null
  image_url: string | null
  max_attendees: number | null
  user_id: string
  event_attendees: { id: string }[] | null
}

type Organizer = { id: string; name: string | null; avatar: string | null }

export type EventWithExtras = Omit<EventRow, "event_attendees"> & {
  attendees: number
  organizer: Organizer | null
}

export async function getEvents(): Promise<EventWithExtras[]> {
  // 1) Eventos + asistentes (esto sí se puede embeber por la FK event_attendees.event_id -> events.id)
  const { data: eventsRaw, error: evErr } = await supabase
    .from("events")
    .select(`
      id,
      title,
      description,
      date,
      time_range,
      location,
      image_url,
      max_attendees,
      user_id,
      event_attendees ( id )
    `)
    .order("date", { ascending: true })

  if (evErr) throw evErr
  const events: EventRow[] = eventsRaw ?? []

  // 2) Obtener perfiles de organizadores con un IN
  const userIds = Array.from(new Set(events.map(e => e.user_id)))
  let byProfileId = new Map<string, Organizer>()

  if (userIds.length > 0) {
    const { data: profiles, error: pfErr } = await supabase
      .from("profiles")
      .select("id, name, avatar")
      .in("id", userIds)

    if (pfErr) throw pfErr
    byProfileId = new Map((profiles ?? []).map(p => [p.id, p as Organizer]))
  }

  // 3) Unir y derivar attendees count
  return events.map(e => ({
    ...e,
    attendees: Array.isArray(e.event_attendees) ? e.event_attendees.length : 0,
    organizer: byProfileId.get(e.user_id) ?? null,
  }))
}


export async function getEventCommentsById(eventId: string) {
  const { data, error } = await supabase
    .from("event_comments")
    .select(`
      id,
      text,
      created_at,
      user:user_id (
        id,
        username,
        avatar
      ),
      replies:event_comment_replies (
        id,
        text,
        created_at,
        user:user_id (
          id,
          username,
          avatar
        )
      )
    `)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function addEventComment(eventId: string, userId: string, text: string) {
  const { data, error } = await supabase
    .from("event_comments")
    .insert([{ event_id: eventId, user_id: userId, text }])
    .select("*")
    .single()

  if (error) throw error
  return data
}

export async function addEventCommentReply(commentId: string, userId: string, text: string) {
  const { data, error } = await supabase
    .from("event_comment_replies")
    .insert([{ comment_id: commentId, user_id: userId, text }])
    .select("*")
    .single()

  if (error) throw error
  return data
}


export async function getFriends(userId: string) {
  const { data, error } = await supabase
    .from("friendships")
    .select(`
      id, status, created_at,
      requester:profiles!fk_requester_profiles(id, username, name, avatar),
      addressee:profiles!fk_addressee_profiles(id, username, name, avatar)
    `)
    .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
    .eq("status", "accepted")

  if (error) throw error

  return (data || []).map((f: any) => {
    const friend = f.requester?.id === userId ? f.addressee : f.requester
    return friend
  })
}

export async function getFriendRequests(userId: string): Promise<FriendRequest[]> {
  const { data, error } = await supabase
    .from("friendships")
    .select(`
      id,
      requester:profiles!fk_requester_profiles(id, username, name, avatar)
    `)
    .eq("addressee_id", userId)
    .eq("status", "pending")

  if (error) throw error

  return (data || []).map((row: any) => ({
    friendshipId: row.id,
    userId: row.requester?.id ?? "unknown",
    username: row.requester?.username ?? "unknown",
    name: row.requester?.name ?? "Desconocido",
    avatar: row.requester?.avatar ?? null,
    moviesWatched: 0,
  }))
}





export async function sendFriendRequest(fromId: string, toId: string) {
  if (fromId === toId) throw new Error("No puede enviarse solicitud a sí mismo.")

  const { data, error } = await supabase
    .from("friendships")
    .insert([{ requester_id: fromId, addressee_id: toId, status: "pending" }])

  // Si salta error de unicidad, informe claro:
  if (error?.code === "23505") {
    throw new Error("Ya existe una relación entre estos usuarios.")
  }
  if (error) throw error
  return data
}

export async function updateFriendRequest(id: string, status: "accepted" | "rejected") {
  const { data, error } = await supabase
    .from("friendships")
    .update({ status })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getFriendSuggestions(currentUserId: string): Promise<UserSuggestion[]> {
  // 1. Obtener relaciones existentes
  const { data: existingRelations, error: errorRelations } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id, status")
    .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
    .in("status", ["pending", "accepted"])

  if (errorRelations) throw errorRelations

  const excludedIds = new Set<string>()
  for (const rel of existingRelations || []) {
    if (rel.requester_id !== currentUserId) excludedIds.add(rel.requester_id)
    if (rel.addressee_id !== currentUserId) excludedIds.add(rel.addressee_id)
  }
  excludedIds.add(currentUserId)

  // 2. Buscar perfiles no relacionados
  const { data: suggestions, error: errorSuggestions } = await supabase
    .from("profiles")
    .select("id, username, name, avatar")
    .not("id", "in", `(${Array.from(excludedIds).join(",")})`)
    .limit(10)

  if (errorSuggestions) throw errorSuggestions

  // 3. Enriquecer los datos con películas vistas y amigos en común
  const enriched = await Promise.all(
    suggestions.map(async (user) => {
      // Count watched movies
      const { count: watchedCount } = await supabase
        .from("watched_movies")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)

      // Get mutual friends
      const { data: mutuals } = await supabase
        .rpc("get_mutual_friends", { user_a: currentUserId, user_b: user.id })

      return {
        ...user,
        moviesWatched: watchedCount ?? 0,
        mutualFriends: mutuals?.length ?? 0,
      }
    })
  )

  return enriched
}



// --- Foro: utilidades básicas por categoría ---

export type ForumThreadListItem = {
  id: string
  title: string
  content: string
  created_at: string
  category_id: string
  user: ForumThreadUser | null
  replies: number
  lastActivity: string
}

// 0) Obtener la categoría (id, name)
export async function getForumCategoryById(categoryId: string) {
  const { data, error } = await supabase
    .from("forum_categories")
    .select("id, name")
    .eq("id", categoryId)
    .single()
  if (error) throw error
  return data
}

export async function getThreadsByCategorySimple(categoryId: string): Promise<ForumThreadListItem[]> {
  const { data: threads, error: thErr } = await supabase
    .from("forum_threads")
    .select(`
      id,
      title,
      content,
      created_at,
      category_id,
      user:profiles!forum_threads_user_profile_fkey ( id, username, name, avatar )
    `)
    .eq("category_id", categoryId)
    .order("created_at", { ascending: false })
  if (thErr) throw thErr

  // 👇 Normalizamos el user (puede venir como array)
  const base = (threads ?? []).map(t => ({
    ...t,
   user: (Array.isArray(t.user) ? t.user[0] : t.user) ?? null,
  }))

  if (base.length === 0) return []

  const threadIds = base.map(t => t.id)
  const { data: comments, error: cmErr } = await supabase
    .from("forum_comments")
    .select("id, thread_id, created_at")
    .in("thread_id", threadIds)
  if (cmErr) throw cmErr

  const agg = new Map<string, { count: number; last: string }>()
  for (const t of base) agg.set(t.id, { count: 0, last: t.created_at })
  for (const c of (comments ?? [])) {
    const a = agg.get(c.thread_id)
    if (!a) continue
    a.count += 1
    if (new Date(c.created_at) > new Date(a.last)) a.last = c.created_at
  }

  return base.map(t => {
    const a = agg.get(t.id)!
    return {
      ...t,
      replies: a.count,
      lastActivity: a.last,
    }
  })
}


// 2) Participantes en una categoría = autores de hilos + comentaristas
export async function getCategoryParticipants(categoryId: string): Promise<ForumThreadUser[]> {
  // Hilos para: autores y para saber qué thread_ids hay
  const { data: threads, error: thErr } = await supabase
    .from("forum_threads")
    .select("id, user_id")
    .eq("category_id", categoryId)
  if (thErr) throw thErr

  const threadIds = (threads ?? []).map(t => t.id)
  const authorIds = new Set<string>((threads ?? []).map(t => t.user_id).filter(Boolean))

  // Comentarios => user_id
  let commenterIds = new Set<string>()
  if (threadIds.length > 0) {
    const { data: comments, error: cmErr } = await supabase
      .from("forum_comments")
      .select("user_id, thread_id")
      .in("thread_id", threadIds)
    if (cmErr) throw cmErr
    for (const c of (comments ?? [])) {
      if (c.user_id) commenterIds.add(c.user_id)
    }
  }

  const allIds = Array.from(new Set<string>([...authorIds, ...commenterIds]))
  if (allIds.length === 0) return []

  const { data: profiles, error: pfErr } = await supabase
    .from("profiles")
    .select("id, username, name, avatar")
    .in("id", allIds)
  if (pfErr) throw pfErr

  // Orden simple por nombre/username
  return (profiles ?? []).sort((a, b) =>
    (a.name ?? a.username ?? "").localeCompare(b.name ?? b.username ?? "")
  )
}


// Top N hilos con más comentarios para una categoría
export async function getTopThreadsByCommentsForCategory(
  categoryId: string,
  limit = 5
): Promise<ForumThreadListItem[]> {
  const threads = await getThreadsByCategorySimple(categoryId)
  return threads
    .slice()
    .sort((a, b) => b.replies - a.replies)
    .slice(0, limit)
}