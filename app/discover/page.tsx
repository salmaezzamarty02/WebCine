"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark, Share2 } from "lucide-react"

type Profile = { id: string; name: string | null; username: string | null; avatar: string | null }
type WatchlistRow = {
  id: string
  name: string
  description: string | null
  cover_url: string | null
  user_id: string
  is_public: boolean
  watchlist_movies?: { movie_id: string }[] | null
  user?: Profile | Profile[] | null
}

type WatchlistCard = {
  id: string
  title: string
  description: string | null
  cover: string | null
  movieCount: number
  owner: Profile | null
  tags: string[]
}

export default function DiscoverWatchlistsPage() {
  const [lists, setLists] = useState<WatchlistCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const { data: wl, error: wErr } = await supabase
        .from("watchlists")
        .select(`
          id, name, description, cover_url, user_id, is_public,
          watchlist_movies ( movie_id )
        `)
        .eq("is_public", true)
        .order("created_at", { ascending: false })

      if (wErr) {
        console.error("Error cargando watchlists:", {
          message: wErr.message,
          details: wErr.details,
          hint: wErr.hint,
          code: wErr.code,
        })
        setLists([])
        setLoading(false)
        return
      }

      const base = wl ?? []

      // dueños
      const ownerIds = Array.from(new Set(base.map(w => w.user_id)))
      let ownersById = new Map<string, Profile>()
      if (ownerIds.length > 0) {
        const { data: owners } = await supabase
          .from("profiles")
          .select("id, name, username, avatar")
          .in("id", ownerIds)
        ownersById = new Map((owners ?? []).map(p => [p.id, p as Profile]))
      }

      // tags (géneros top)
      const wlIds = base.map(w => w.id)
      const topGenresByWL = new Map<string, string[]>()
      if (wlIds.length > 0) {
        const { data: rows } = await supabase
          .from("watchlist_movies")
          .select(`watchlist_id, movies:movie_id ( genre )`)
          .in("watchlist_id", wlIds)

        const counts = new Map<string, Map<string, number>>()
        for (const r of rows ?? []) {
          const wlId = (r as any).watchlist_id as string
          const genreStr = (r as any).movies?.genre as string | null
          if (!wlId || !genreStr) continue
          const parts = genreStr.split(",").map(s => s.trim()).filter(Boolean)
          if (!counts.has(wlId)) counts.set(wlId, new Map())
          const m = counts.get(wlId)!
          for (const g of parts) m.set(g, (m.get(g) ?? 0) + 1)
        }
        for (const [wlId, m] of counts) {
          const top = Array.from(m.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([g]) => g)
          topGenresByWL.set(wlId, top)
        }
      }

      const cooked: WatchlistCard[] = base.map(w => ({
        id: w.id,
        title: w.name,
        description: w.description,
        cover: w.cover_url,
        movieCount: Array.isArray(w.watchlist_movies) ? w.watchlist_movies.length : 0,
        owner: ownersById.get(w.user_id) ?? null,
        tags: topGenresByWL.get(w.id) ?? [],
      }))

      setLists(cooked)
      setLoading(false)
    }

    load()
  }, [])

  const content = useMemo(() => {
    if (loading) return <div className="text-gray-400">Cargando listas…</div>
    if (lists.length === 0) return <div className="text-gray-400">No hay listas públicas todavía.</div>

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map(list => (
          <div key={list.id} className="rounded-lg border border-gray-800 overflow-hidden group">
            <Link href={`/watchlists/${list.id}`} className="block">
              <div className="h-44 relative">
                <img
                  src={list.cover || "/cover.png"}
                  alt={list.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    {list.movieCount} películas
                  </Badge>
                </div>
              </div>
            </Link>

            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <Link href={`/watchlists/${list.id}`} className="block">
                    <h3 className="font-medium text-lg hover:text-primary transition-colors">
                      {list.title}
                    </h3>
                  </Link>
                  {list.description && (
                    <p className="text-sm text-gray-400 mt-1">{list.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-3">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={list.owner?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {(list.owner?.name ?? list.owner?.username ?? "U").slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Link href={`/profile/${list.owner?.id ?? ""}`}>
                  <span className="text-sm text-gray-400 hover:text-primary">
                    {list.owner?.name ?? list.owner?.username ?? "Usuario"}
                  </span>
                </Link>
              </div>

              <div className="flex flex-wrap gap-1 mt-4">
                {list.tags.length > 0 ? (
                  list.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs border-gray-700 text-gray-300">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <Badge variant="outline" className="text-xs border-gray-700 text-gray-500">
                    Sin etiquetas
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800">
                <Button size="sm" className="flex-1">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Seguir
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }, [loading, lists])

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Descubrir listas</h1>
          <p className="text-gray-400">Explora listas públicas creadas por la comunidad</p>
        </div>

        {content}
      </div>
    </div>
  )
}
