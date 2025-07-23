// app/api/watchlists/[id]/route.ts
import { supabase } from "@/lib/supabaseClient"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"




export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const watchlistId = context.params.id

  const { data: watchlist, error } = await supabase
    .from("watchlists")
    .select(`
      id,
      name,
      description,
      is_public,
      cover_url,
      watchlist_movies:watchlist_movies (
        movie:movies (
          id,
          title,
          image_url,
          release_year
        ),
        added_at
      )
    `)
    .eq("id", watchlistId)
    .single()

  if (error || !watchlist) {
    console.error("❌ Error al cargar la watchlist:", error?.message)
    return NextResponse.json({ error: "No se pudo cargar la lista" }, { status: 404 })
  }

  return NextResponse.json({ watchlist })
}



// ✅ PATCH — Editar una watchlist
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const body = await req.json()
  const { name, description, is_public, cover_url, movie_ids} = body

  const cookieStore = cookies()
  const access_token = (await cookieStore).get("access_token")?.value

  if (!access_token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getUser(access_token)
  if (sessionError || !sessionData.user) {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 401 })
  }

  // ✅ 1. Actualizar los datos de la watchlist
  const { error: updateError } = await supabase
    .from("watchlists")
    .update({ name, description, is_public, cover_url})
    .eq("id", id)
    .eq("user_id", sessionData.user.id)

  if (updateError) {
    console.error("Error al actualizar:", updateError.message)
    return NextResponse.json({ error: "No se pudo actualizar la lista" }, { status: 500 })
  }

  // ✅ 2. Eliminar relaciones anteriores
  const { error: deleteError } = await supabase
    .from("watchlist_movies")
    .delete()
    .eq("watchlist_id", id)

  if (deleteError) {
    console.error("Error al borrar películas anteriores:", deleteError.message)
    return NextResponse.json({ error: "Error al actualizar películas" }, { status: 500 })
  }

  // ✅ 3. Insertar nuevas relaciones
  if (Array.isArray(movie_ids) && movie_ids.length > 0) {
    const inserts = movie_ids.map((movieId: string) => ({
      watchlist_id: id,
      movie_id: movieId,
    }))

    const { error: insertError } = await supabase
      .from("watchlist_movies")
      .insert(inserts)

    if (insertError) {
      console.error("Error al insertar nuevas películas:", insertError.message)
      return NextResponse.json({ error: "Error al guardar las nuevas películas" }, { status: 500 })
    }
  }

  return NextResponse.json({ message: "Lista actualizada con éxito" }, { status: 200 })
}

// ✅ DELETE — Eliminar una watchlist
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const watchlistId = params.id

  const cookieStore = cookies()
  const access_token = (await cookieStore).get("access_token")?.value

  if (!access_token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getUser(access_token)
  if (sessionError || !sessionData.user) {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 401 })
  }

  const { error } = await supabase
    .from("watchlists")
    .delete()
    .eq("id", watchlistId)
    .eq("user_id", sessionData.user.id)

  if (error) {
    console.error("Error al eliminar watchlist:", error.message)
    return NextResponse.json({ error: "No se pudo eliminar la lista" }, { status: 500 })
  }

  return NextResponse.json({ message: "Lista eliminada con éxito" }, { status: 200 })
}