import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Film, Star, MessageSquare, Heart, Bookmark, TrendingUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabaseServer"

// ===== Next SSR per-user =====
export const dynamic = "force-dynamic"
export const revalidate = 0

// ===== Tipos auxiliares =====
type MovieMini = {
  id: string
  title: string
  image_url: string | null
  release_year: number
  rating: number | null
}

type EventCard = {
  id: string
  title: string
  date: string          // YYYY-MM-DD
  time_range: string | null
  location: string | null
  image_url: string | null
  attendees: number
}

type UserSummary = { id: string; name: string; avatar: string | null }
type MovieInFeed = { id: string; title: string; year: string; poster: string | null }

type ReviewActivity = {
  id: string
  type: "review"
  user: UserSummary
  movie: MovieInFeed
  rating: number
  content: string | null
  timestamp: string // ISO
  likes: number
}

type WatchedActivity = {
  id: string
  type: "watched"
  user: UserSummary
  movie: MovieInFeed
  timestamp: string // ISO
}

type ListActivity = {
  id: string
  type: "list"
  user: UserSummary
  list: { id: string; title: string }
  movies: MovieInFeed[]
  timestamp: string // ISO
}

type Activity = ReviewActivity | WatchedActivity | ListActivity
// ✅ ahora amigos también pueden ser listas
type FriendActivity = ReviewActivity | WatchedActivity | ListActivity

function formatDateEs(d: string) {
  const [y, m, day] = d.split("-").map(Number)
  const dt = new Date(y, (m ?? 1) - 1, day ?? 1)
  return dt.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })
}

// ===== Helpers aplanado relaciones =====
type DbMovieRow = { id: string; title: string; image_url: string | null; release_year: number | null }

function firstOrNull<T>(v: T | T[] | null | undefined): T | null {
  return Array.isArray(v) ? (v[0] ?? null) : (v ?? null)
}

function toFeedMovie(v: any): MovieInFeed | null {
  const m = firstOrNull<DbMovieRow>(v)
  if (!m) return null
  return {
    id: m.id,
    title: m.title,
    year: String(m.release_year ?? ""),
    poster: m.image_url ?? null,
  }
}

export default async function HomePage() {
  const supabase = await createClient()

  // =======================
  // 1) Año más reciente
  // =======================
  const { data: latestYearRow } = await supabase
    .from("movies")
    .select("release_year")
    .order("release_year", { ascending: false })
    .limit(1)
    .single()

  const latestYear = latestYearRow?.release_year ?? null

  // 2) Tendencias (último año)
  let trendingMovies: MovieMini[] = []
  if (latestYear !== null) {
    const { data } = await supabase
      .from("movies")
      .select("id, title, image_url, release_year, rating")
      .eq("release_year", latestYear)
      .not("rating", "is", null)
      .order("rating", { ascending: false })
      .limit(4)
    trendingMovies = data ?? []
  }

  // 3) Recomendados (años anteriores)
  let recommendedMovies: MovieMini[] = []
  if (latestYear !== null) {
    const { data } = await supabase
      .from("movies")
      .select("id, title, image_url, release_year, rating")
      .lt("release_year", latestYear)
      .not("rating", "is", null)
      .order("rating", { ascending: false })
      .order("release_year", { ascending: false })
      .limit(4)
    recommendedMovies = data ?? []
  }

  // =======================
  // 4) Próximos eventos
  // =======================
  const todayISO = new Date().toISOString().slice(0, 10)

  const { data: eventsRaw } = await supabase
    .from("events")
    .select("id, title, date, time_range, location, image_url")
    .gte("date", todayISO)
    .order("date", { ascending: true })
    .limit(2)

  const upcomingEvents: EventCard[] = eventsRaw
    ? await Promise.all(
        eventsRaw.map(async (ev) => {
          const { count } = await supabase
            .from("event_attendees")
            .select("*", { count: "exact", head: true })
            .eq("event_id", ev.id)

          return {
            id: ev.id,
            title: ev.title,
            date: ev.date,
            time_range: ev.time_range ?? null,
            location: ev.location ?? null,
            image_url: ev.image_url ?? null,
            attendees: count ?? 0,
          }
        })
      )
    : []

  // =======================
  // 5) Feeds
  // =======================

  // Usuario actual (SSR)
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const uid = user?.id ?? null

  // Helper: perfiles
  async function loadProfiles(ids: string[]) {
    if (!ids.length) return new Map<string, UserSummary>()
    const { data } = await supabase
      .from("profiles")
      .select("id, name, avatar")
      .in("id", ids)
    const map = new Map<string, UserSummary>()
    for (const p of data ?? [])
      map.set(p.id, { id: p.id, name: p.name ?? "Usuario", avatar: p.avatar ?? null })
    return map
  }

  // Amigos (RPC con fallback a tabla friendships)
  let friendIds: string[] = []
  if (uid) {
    type AcceptedFriendshipRow = { friendship_id: string; friend_id: string }
    const { data: acceptedRows, error: frErr } = await supabase
      .rpc("get_user_accepted_friendships", { p_user: uid })

    if (!frErr && (acceptedRows?.length ?? 0) > 0) {
      friendIds = Array.from(
        new Set(((acceptedRows ?? []) as AcceptedFriendshipRow[]).map(r => r.friend_id))
      )
    } else {
      // Fallback directo a friendships
      const { data: friendships } = await supabase
        .from("friendships")
        .select("requester_id, addressee_id, status")
        .eq("status", "accepted")
        .or(`requester_id.eq.${uid},addressee_id.eq.${uid}`)
        .limit(500)

      if (friendships?.length) {
        friendIds = Array.from(
          new Set(
            friendships.map(f => (f.requester_id === uid ? f.addressee_id : f.requester_id))
          )
        )
      }
    }
  }

  // IDs de pelis que YO he visto
  const { data: myWatchedRows } = uid
    ? await supabase
        .from("watched_movies")
        .select("movie_id")
        .eq("user_id", uid)
        .order("watched_at", { ascending: false })
        .limit(500)
    : { data: null as any }

  const myMovieIds = Array.from(new Set((myWatchedRows ?? []).map((r: any) => r.movie_id))) as string[]

  // Ventanas temporales
  const fourteenDaysAgoISO = new Date(Date.now() - 14 * 24 * 3600 * 1000).toISOString()
  const seventyTwoHoursAgoISO = new Date(Date.now() - 72 * 3600 * 1000).toISOString()

  // ======== PARA TI – BLOQUE 1: Reseñas de pelis que YO vi (de otros) ========
  let forYou_reviews: ReviewActivity[] = []
  if (uid && myMovieIds.length) {
    const { data } = await supabase
      .from("reviews")
      .select(`
        id, rating, content, created_at, likes_count, user_id, movie_id,
        movie:movies(id, title, image_url, release_year)
      `)
      .in("movie_id", myMovieIds)
      .neq("user_id", uid) // excluir mis reseñas
      .gte("created_at", fourteenDaysAgoISO)
      .order("created_at", { ascending: false })
      .limit(50)

    const userIds = Array.from(new Set((data ?? []).map(r => r.user_id)))
    const profileMap = await loadProfiles(userIds)

    forYou_reviews = ((data ?? [])
      .map((r: any) => {
        const m = toFeedMovie(r.movie)
        if (!m) return null
        return {
          id: r.id,
          type: "review" as const,
          user: profileMap.get(r.user_id) ?? { id: r.user_id, name: "Usuario", avatar: null },
          movie: m,
          rating: r.rating ?? 0,
          content: r.content ?? null,
          timestamp: r.created_at,
          likes: r.likes_count ?? 0,
        }
      })
      .filter(Boolean)) as ReviewActivity[]
  }

  // ======== PARA TI – BLOQUE 2: Comunidad vio pelis que YO ya vi ========
  async function loadCommunityWatched(sinceISO: string) {
    const { data } = await supabase
      .from("watched_movies")
      .select(`id, user_id, watched_at, movie:movies(id, title, image_url, release_year)`)
      .in("movie_id", myMovieIds)
      .neq("user_id", uid!)
      .gte("watched_at", sinceISO)
      .order("watched_at", { ascending: false })
      .limit(80)

    const userIds = Array.from(new Set((data ?? []).map((w: any) => w.user_id)))
    const profileMap = await loadProfiles(userIds)

    const acts: WatchedActivity[] = ((data ?? [])
      .map((w: any) => {
        const m = toFeedMovie(w.movie)
        if (!m) return null
        return {
          id: w.id,
          type: "watched" as const,
          user: profileMap.get(w.user_id) ?? { id: w.user_id, name: "Usuario", avatar: null },
          movie: m,
          timestamp: w.watched_at,
        }
      })
      .filter(Boolean)) as WatchedActivity[]

    return acts
  }

  let forYou_communityWatched: WatchedActivity[] = []
  if (uid && myMovieIds.length) {
    forYou_communityWatched = await loadCommunityWatched(fourteenDaysAgoISO)
    // Fallback 90 días si en 14 días no hay nada
    if (forYou_communityWatched.length === 0) {
      const ninetyDaysAgoISO = new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString()
      forYou_communityWatched = await loadCommunityWatched(ninetyDaysAgoISO)
    }
  }

  // ======== PARA TI – BLOQUE 3: Listas con ≥1 peli que YO vi (de otros) ========
  async function buildListActivities(listIds: string[], excludeUserId?: string): Promise<ListActivity[]> {
    if (!listIds.length) return []
    // traer listas
    const { data: lists } = await supabase
      .from("watchlists")
      .select("id, name, created_at, user_id")
      .in("id", listIds)

    if (!lists?.length) return []

    // sample de pelis por lista
    const { data: listMovies } = await supabase
      .from("watchlist_movies")
      .select("watchlist_id, movies:movie_id(id, title, image_url, release_year)")
      .in("watchlist_id", lists.map((l: any) => l.id))

    const moviesByList = new Map<string, MovieInFeed[]>()
    for (const row of listMovies ?? []) {
      const m = toFeedMovie((row as any).movies)
      if (!m) continue
      const arr = moviesByList.get((row as any).watchlist_id) ?? []
      arr.push(m)
      moviesByList.set((row as any).watchlist_id, arr)
    }

    // perfiles dueños
    const ownerIds = Array.from(new Set(lists.map((wl: any) => wl.user_id)))
    const ownersMap = await loadProfiles(ownerIds)

    const acts: ListActivity[] = lists
      .filter((wl: any) => (excludeUserId ? wl.user_id !== excludeUserId : true))
      .map((wl: any) => {
        const posters = (moviesByList.get(wl.id) ?? []).slice(0, 3)
        const owner = ownersMap.get(wl.user_id) ?? { id: wl.user_id, name: "Usuario", avatar: null }
        return {
          id: wl.id,
          type: "list" as const,
          user: owner,
          list: { id: wl.id, title: wl.name },
          movies: posters,
          timestamp: wl.created_at,
        }
      })

    return acts
  }

  let forYou_lists: ListActivity[] = []
  if (uid && myMovieIds.length) {
    // Paso 1: listas que contienen alguna de mis pelis
    const { data: wlLinks } = await supabase
      .from("watchlist_movies")
      .select("watchlist_id, movie_id")
      .in("movie_id", myMovieIds)
      .limit(500)

    const listIds = Array.from(new Set((wlLinks ?? []).map((r: any) => r.watchlist_id)))

    if (listIds.length) {
      // Paso 2: quedarnos con las públicas y que no sean mías
      const { data: listsPub } = await supabase
        .from("watchlists")
        .select("id")
        .eq("is_public", true)
        .neq("user_id", uid)
        .in("id", listIds)
        .order("created_at", { ascending: false })
        .limit(20)

      forYou_lists = await buildListActivities((listsPub ?? []).map((l: any) => l.id), uid)
    }

    // 🔁 Fallback: si no hay coincidencias con tus pelis, coger listas públicas recientes (de otros)
    if (forYou_lists.length === 0) {
      const { data: recentLists } = await supabase
        .from("watchlists")
        .select("id")
        .eq("is_public", true)
        .neq("user_id", uid)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString())
        .order("created_at", { ascending: false })
        .limit(20)

      forYou_lists = await buildListActivities((recentLists ?? []).map((l: any) => l.id), uid)
    }
  }

  // Concatenación “Para ti”
  let feedActivities: Activity[] = []
  if (uid) {
    const block1 = forYou_reviews.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
    const block2 = forYou_communityWatched.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
    const block3 = forYou_lists.sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
    feedActivities = [...block1, ...block2, ...block3].slice(0, 30)
  }

  // ===== Amigos (reseñas + vistos + listas) =====
  let friendsActivities: FriendActivity[] = []

  async function loadFriendsLists(sinceISO: string) {
    if (!friendIds.length) return []
    // Listas públicas creadas por amigos
    const { data: lists } = await supabase
      .from("watchlists")
      .select("id, name, created_at, user_id")
      .in("user_id", friendIds)
      .eq("is_public", true)
      .gte("created_at", sinceISO)
      .order("created_at", { ascending: false })
      .limit(40)

    if (!lists?.length) return []

    return buildListActivities(lists.map((l: any) => l.id))
  }

  async function loadFriendsActivity(sinceISO: string) {
    const [friendReviewsRaw, watched, listsActs] = await Promise.all([
      supabase
        .from("reviews")
        .select(`
          id, rating, content, created_at, likes_count, user_id,
          movie:movies(id, title, image_url, release_year)
        `)
        .in("user_id", friendIds)
        .gte("created_at", sinceISO)
        .order("created_at", { ascending: false })
        .limit(30),
      supabase
        .from("watched_movies")
        .select(`id, user_id, watched_at, movie:movies(id, title, image_url, release_year)`)
        .in("user_id", friendIds)
        .gte("watched_at", sinceISO)
        .order("watched_at", { ascending: false })
        .limit(40),
      loadFriendsLists(sinceISO),
    ])

    const userIds = Array.from(
      new Set([...(friendReviewsRaw.data ?? []).map(r => r.user_id), ...(watched.data ?? []).map(w => w.user_id)])
    )
    const profilesMap = await loadProfiles(userIds)

    const friendReviews: ReviewActivity[] = ((friendReviewsRaw.data ?? [])
      .map((r: any) => {
        const m = toFeedMovie(r.movie)
        if (!m) return null
        return {
          id: r.id,
          type: "review" as const,
          user: profilesMap.get(r.user_id) ?? { id: r.user_id, name: "Usuario", avatar: null },
          movie: m,
          rating: r.rating ?? 0,
          content: r.content ?? null,
          timestamp: r.created_at,
          likes: r.likes_count ?? 0,
        }
      })
      .filter(Boolean)) as ReviewActivity[]

    const watchedActs: WatchedActivity[] = ((watched.data ?? [])
      .map((w: any) => {
        const m = toFeedMovie(w.movie)
        if (!m) return null
        return {
          id: w.id,
          type: "watched" as const,
          user: profilesMap.get(w.user_id) ?? { id: w.user_id, name: "Usuario", avatar: null },
          movie: m,
          timestamp: w.watched_at,
        }
      })
      .filter(Boolean)) as WatchedActivity[]

    const friendLists = (await listsActs) as ListActivity[]

    return [...friendReviews, ...watchedActs, ...friendLists]
      .sort((a, b) => +new Date(b.timestamp) - +new Date(a.timestamp))
      .slice(0, 30)
  }

  if (friendIds.length) {
    friendsActivities = await loadFriendsActivity(fourteenDaysAgoISO)
    if (friendsActivities.length === 0) {
      const ninetyDaysAgoISO = new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString()
      friendsActivities = await loadFriendsActivity(ninetyDaysAgoISO)
    }
  }

  // ===== Popular (reseñas 72h) =====
  let popularActivities: ReviewActivity[] = []
  {
    let popQuery = supabase
      .from("reviews")
      .select(`
        id, rating, content, created_at, likes_count, user_id,
        movie:movies(id, title, image_url, release_year)
      `)
      .gte("created_at", seventyTwoHoursAgoISO)
    if (uid) popQuery = popQuery.neq("user_id", uid)

    const { data } = await popQuery
      .order("likes_count", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(30)

    const userIds = Array.from(new Set((data ?? []).map(r => r.user_id)))
    const profileMap = await loadProfiles(userIds)

    popularActivities = ((data ?? [])
      .map((r: any) => {
        const m = toFeedMovie(r.movie)
        if (!m) return null
        return {
          id: r.id,
          type: "review" as const,
          user: profileMap.get(r.user_id) ?? { id: r.user_id, name: "Usuario", avatar: null },
          movie: m,
          rating: r.rating ?? 0,
          content: r.content ?? null,
          timestamp: r.created_at,
          likes: r.likes_count ?? 0,
        }
      })
      .filter(Boolean)) as ReviewActivity[]
  }

  // Fallback de “Para ti”
  if (!uid || feedActivities.length === 0) {
    feedActivities = (popularActivities as Activity[]).slice(0, 20)
  }

  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="feed">Para ti</TabsTrigger>
              <TabsTrigger value="friends">Amigos</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>

            {/* PARA TI */}
            <TabsContent value="feed" className="space-y-6">
              {feedActivities.length ? (
                feedActivities.map((activity) => (
                  <div key={activity.id} className="rounded-lg border border-gray-800 bg-card overflow-hidden">
                    {/* Header */}
                    <div className="p-4 flex items-start justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={activity.user.avatar ?? ""} alt={activity.user.name} />
                          <AvatarFallback>{activity.user.name?.substring(0, 2)?.toUpperCase() ?? "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            <Link href={`/profile/${activity.user.id}`} className="hover:underline">
                              {activity.user.name}
                            </Link>
                            {activity.type === "review" && <span className="text-gray-400"> reseñó una película</span>}
                            {activity.type === "watched" && <span className="text-gray-400"> vio una película</span>}
                            {activity.type === "list" && <span className="text-gray-400"> creó una lista</span>}
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    {activity.type === "review" && (
                      <div className="px-4 pb-4">
                        <div className="flex items-start mb-3">
                          <div className="w-16 h-24 relative mr-3 flex-shrink-0">
                            <Image
                              src={activity.movie.poster || "/placeholder.svg"}
                              alt={activity.movie.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <Link href={`/movie/${activity.movie.id}`} className="font-medium hover:underline">
                              {activity.movie.title}
                            </Link>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(activity.rating)
                                          ? "text-yellow-400 fill-current"
                                          : i < activity.rating
                                          ? "text-yellow-400 fill-current opacity-50"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                              </div>
                              <span className="ml-2 text-sm">{activity.rating}/5</span>
                            </div>
                            {activity.content && <p className="text-sm text-gray-300 mt-2">{activity.content}</p>}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                          <div className="flex space-x-4">
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                              <Heart className="h-4 w-4 mr-1" />
                              <span>{(activity as ReviewActivity).likes ?? 0}</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                              <MessageSquare className="h-4 w-4 mr-1" />
                            </Button>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {activity.type === "watched" && (
                      <div className="px-4 pb-4">
                        <div className="flex items-center">
                          <div className="w-16 h-24 relative mr-3 flex-shrink-0">
                            <Image
                              src={activity.movie.poster || "/placeholder.svg"}
                              alt={activity.movie.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <Link href={`/movie/${activity.movie.id}`} className="font-medium hover:underline">
                              {activity.movie.title}
                            </Link>
                            <p className="text-sm text-gray-400">{activity.movie.year}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activity.type === "list" && (
                      <div className="px-4 pb-4">
                        <Link href={`/watchlists/${(activity as ListActivity).list.id}`} className="font-medium text-lg hover:underline">
                          {(activity as ListActivity).list.title}
                        </Link>
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                          {(activity as ListActivity).movies.map((m) => (
                            <div key={m.id} className="w-20 flex-shrink-0">
                              <div className="w-20 h-30 relative mb-1">
                                <Image
                                  src={m.poster || "/placeholder.svg"}
                                  alt={m.title}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <p className="text-xs truncate">{m.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Film className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Sin actividad aún</h3>
                  <p className="text-gray-400 mb-4">Empiece viendo pelis o creando listas.</p>
                </div>
              )}
            </TabsContent>

            {/* AMIGOS */}
            <TabsContent value="friends" className="space-y-6">
              {friendsActivities.length ? (
                friendsActivities.map((activity) => (
                  <div key={activity.id} className="rounded-lg border border-gray-800 bg-card overflow-hidden">
                    {/* Header */}
                    <div className="p-4 flex items-start justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={activity.user.avatar ?? ""} alt={activity.user.name} />
                          <AvatarFallback>{activity.user.name?.substring(0, 2)?.toUpperCase() ?? "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            <Link href={`/profile/${activity.user.id}`} className="hover:underline">
                              {activity.user.name}
                            </Link>
                            {activity.type === "review" && <span className="text-gray-400"> reseñó una película</span>}
                            {activity.type === "watched" && <span className="text-gray-400"> vio una película</span>}
                            {activity.type === "list" && <span className="text-gray-400"> creó una lista</span>}
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    {activity.type === "review" && (
                      <div className="px-4 pb-4">
                        <div className="flex items-start mb-3">
                          <div className="w-16 h-24 relative mr-3 flex-shrink-0">
                            <Image
                              src={activity.movie.poster || "/placeholder.svg"}
                              alt={activity.movie.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <Link href={`/movie/${activity.movie.id}`} className="font-medium hover:underline">
                              {activity.movie.title}
                            </Link>
                            <div className="flex items-center mt-1">
                              <div className="flex">
                                {Array(5)
                                  .fill(0)
                                  .map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${
                                        i < Math.floor(activity.rating)
                                          ? "text-yellow-400 fill-current"
                                          : i < activity.rating
                                          ? "text-yellow-400 fill-current opacity-50"
                                          : "text-gray-600"
                                      }`}
                                    />
                                  ))}
                              </div>
                              <span className="ml-2 text-sm">{activity.rating}/5</span>
                            </div>
                            {activity.content && <p className="text-sm text-gray-300 mt-2">{activity.content}</p>}
                          </div>
                        </div>
                      </div>
                    )}

                    {activity.type === "watched" && (
                      <div className="px-4 pb-4">
                        <div className="flex items-center">
                          <div className="w-16 h-24 relative mr-3 flex-shrink-0">
                            <Image
                              src={activity.movie.poster || "/placeholder.svg"}
                              alt={activity.movie.title}
                              fill
                              className="object-cover rounded-md"
                            />
                          </div>
                          <div>
                            <Link href={`/movie/${activity.movie.id}`} className="font-medium hover:underline">
                              {activity.movie.title}
                            </Link>
                            <p className="text-sm text-gray-400">{activity.movie.year}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activity.type === "list" && (
                      <div className="px-4 pb-4">
                        <Link href={`/watchlists/${(activity as ListActivity).list.id}`} className="font-medium text-lg hover:underline">
                          {(activity as ListActivity).list.title}
                        </Link>
                        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                          {(activity as ListActivity).movies.map((m) => (
                            <div key={m.id} className="w-20 flex-shrink-0">
                              <div className="w-20 h-30 relative mb-1">
                                <Image
                                  src={m.poster || "/placeholder.svg"}
                                  alt={m.title}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <p className="text-xs truncate">{m.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Film className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Actividad de amigos</h3>
                  <p className="text-gray-400 mb-4">Aquí verá la actividad reciente de sus amigos.</p>
                  <Button asChild>
                    <Link href="/friends">Encontrar amigos</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* POPULAR */}
            <TabsContent value="popular" className="space-y-6">
              {popularActivities.length ? (
                popularActivities.map((activity) => (
                  <div key={activity.id} className="rounded-lg border border-gray-800 bg-card overflow-hidden">
                    {/* Header */}
                    <div className="p-4 flex items-start justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-10 w-10 mr-3">
                          <AvatarImage src={activity.user.avatar ?? ""} alt={activity.user.name} />
                          <AvatarFallback>{activity.user.name?.substring(0, 2)?.toUpperCase() ?? "?"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">
                            <Link href={`/profile/${activity.user.id}`} className="hover:underline">
                              {activity.user.name}
                            </Link>
                            <span className="text-gray-400"> reseñó una película</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString("es-ES")}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content (reseña) */}
                    <div className="px-4 pb-4">
                      <div className="flex items-start mb-3">
                        <div className="w-16 h-24 relative mr-3 flex-shrink-0">
                          <Image
                            src={activity.movie.poster || "/placeholder.svg"}
                            alt={activity.movie.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                        <div>
                          <Link href={`/movie/${activity.movie.id}`} className="font-medium hover:underline">
                            {activity.movie.title}
                          </Link>
                          <div className="flex items-center mt-1">
                            <div className="flex">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(activity.rating)
                                        ? "text-yellow-400 fill-current"
                                        : i < activity.rating
                                        ? "text-yellow-400 fill-current opacity-50"
                                        : "text-gray-600"
                                    }`}
                                  />
                                ))}
                            </div>
                            <span className="ml-2 text-sm">{activity.rating}/5</span>
                          </div>
                          {activity.content && (
                            <p className="text-sm text-gray-300 mt-2">{activity.content}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                        <div className="flex space-x-4">
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <Heart className="h-4 w-4 mr-1" />
                            <span>{activity.likes ?? 0}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                            <MessageSquare className="h-4 w-4 mr-1" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-primary">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <TrendingUp className="h-12 w-12 text-gray-500 mb-4" />
                  <h3 className="text-xl font-medium mb-2">Contenido popular</h3>
                  <p className="text-gray-400 mb-4">Aquí verá las películas y reseñas más populares.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Trending Movies */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Tendencias</h2>
              <Link href="/trending" className="text-sm text-primary hover:underline">
                Ver más
              </Link>
            </div>
            <div className="space-y-4">
              {(trendingMovies ?? []).slice(0, 4).map((movie) => (
                <div key={movie.id} className="flex items-center">
                  <div className="w-12 h-18 relative mr-3 flex-shrink-0">
                    <Image
                      src={movie.image_url || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <Link href={`/movie/${movie.id}`} className="font-medium text-sm hover:underline line-clamp-1">
                      {movie.title}
                    </Link>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-400">
                        {movie.rating !== null ? movie.rating.toFixed(1) : "—"}/5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!trendingMovies || trendingMovies.length === 0) && (
                <p className="text-sm text-gray-500">No hay datos de tendencias aún.</p>
              )}
            </div>
          </div>

          {/* Recommended Movies */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Recomendados</h2>
              <Link href="/recommendations" className="text-sm text-primary hover:underline">
                Ver más
              </Link>
            </div>
            <div className="space-y-4">
              {(recommendedMovies ?? []).slice(0, 4).map((movie) => (
                <div key={movie.id} className="flex items-center">
                  <div className="w-12 h-18 relative mr-3 flex-shrink-0">
                    <Image
                      src={movie.image_url || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div>
                    <Link href={`/movie/${movie.id}`} className="font-medium text-sm hover:underline line-clamp-1">
                      {movie.title}
                    </Link>
                    <div className="flex items-center mt-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-xs text-gray-400">
                        {movie.rating !== null ? movie.rating.toFixed(1) : "—"}/5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {(!recommendedMovies || recommendedMovies.length === 0) && (
                <p className="text-sm text-gray-500">No hay recomendaciones aún.</p>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Próximos eventos</h2>
              <Link href="/events" className="text-sm text-primary hover:underline">
                Ver más
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="rounded-lg border border-gray-800 overflow-hidden">
                    <div className="h-32 relative">
                      <Image
                        src={event.image_url || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{event.title}</h3>
                      <div className="text-sm text-gray-400 mt-1">
                        <p>
                          {formatDateEs(event.date)}
                          {event.time_range ? ` • ${event.time_range}` : ""}
                        </p>
                        {event.location && <p>{event.location}</p>}
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-800">
                        <span className="text-xs text-gray-400">{event.attendees} asistentes</span>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/events/${event.id}`}>Ver</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No hay eventos próximos.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
