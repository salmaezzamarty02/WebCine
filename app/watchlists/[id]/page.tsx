// app/watchlists/[id]/page.tsx

import { createClient } from "@/lib/supabaseServer";
import { WatchlistDetail } from "./WatchlistDetail";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function WatchlistPage({ params }: Props) {
  const supabase = await createClient();

  const { data: watchlist, error } = await supabase
    .from("watchlists")
    .select(`
      *,
      movies:watchlist_movies(
        added_at,
        movie:movies(
          id, title, image_url, release_year, director, rating
        )
      )
    `)
    .eq("id", params.id)
    .single();

  if (error || !watchlist) {
    console.error("Error fetching watchlist:", error);
    return notFound();
  }

  // Si quieres traer el usuario manualmente:
  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("id, name, avatar")
    .eq("id", watchlist.user_id)
    .single();

  if (userError) {
    console.error("Error fetching user:", userError);
    return notFound();
  }

  const watchlistWithUser = { ...watchlist, user };

  return <WatchlistDetail watchlist={watchlistWithUser} />;
}
