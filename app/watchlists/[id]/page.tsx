// app/watchlists/[id]/page.tsx
import { notFound } from "next/navigation"
import { WatchlistDetail } from "./WatchlistDetail"
import { createClient } from "@/lib/supabaseServer"

export const dynamic = "force-dynamic" // 👈 Esto evita el error

interface Props {
  params: { id: string }
}

export default async function WatchlistPage({ params }: Props) {
  const supabase = await createClient()

  const { data: watchlist, error } = await supabase
    .from("watchlists")
    .select(`
      *,
      user:profiles(id, name, avatar),
      movies:watchlist_movies(
        added_at,
        movie:movies(
          id, title, image_url, release_year, director, rating
        )
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !watchlist) return notFound()

  return <WatchlistDetail watchlist={watchlist} />
}
