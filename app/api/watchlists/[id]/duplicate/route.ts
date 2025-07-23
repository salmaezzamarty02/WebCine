//app/api/watchlists/[id]/duplicate/route.ts
import { supabase } from "@/lib/supabaseClient"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const originalId = params.id

  const cookieStore = await cookies()
  const access_token = cookieStore.get("access_token")?.value

  if (!access_token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getUser(access_token)
  if (sessionError || !sessionData.user) {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 401 })
  }

  const { data: original, error: fetchError } = await supabase
    .from("watchlists")
    .select(`
      name,
      description,
      is_public,
      cover_url,
      watchlist_movies:watchlist_movies (
        movie_id
      )
    `)
    .eq("id", originalId)
    .single()

  if (fetchError || !original) {
    return NextResponse.json({ error: "No se pudo cargar la watchlist original" }, { status: 404 })
  }

  const { data: newWatchlist, error: insertError } = await supabase
    .from("watchlists")
    .insert({
      name: original.name + " (copia)",
      description: original.description,
      is_public: false,
      cover_url: original.cover_url,
      user_id: sessionData.user.id
    })
    .select("id")
    .single()

  if (insertError || !newWatchlist) {
    return NextResponse.json({ error: "No se pudo crear la copia" }, { status: 500 })
  }

  const inserts = original.watchlist_movies.map((wm: any) => ({
    watchlist_id: newWatchlist.id,
    movie_id: wm.movie_id
  }))

  if (inserts.length > 0) {
    const { error: copyMoviesError } = await supabase
      .from("watchlist_movies")
      .insert(inserts)

    if (copyMoviesError) {
      console.error("❌ Error al copiar películas:", copyMoviesError.message)
    }
  }

  return NextResponse.json({ id: newWatchlist.id }, { status: 201 })
}
