// app/api/watchlists/route.ts
import { supabase } from "@/lib/supabaseClient"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { name, description, is_public, movie_ids } = await req.json()

    // Validaciones mínimas
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 })
    }

    const cookieStore = await cookies()
const access_token = cookieStore.get("access_token")?.value

    if (!access_token) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 })
    }

    const { data: sessionData, error: sessionError } = await supabase.auth.getUser(access_token)

    if (sessionError || !sessionData.user) {
      return NextResponse.json({ error: "Sesión inválida" }, { status: 401 })
    }

    const user_id = sessionData.user.id

    // Crear la watchlist
    const { data: newWatchlist, error: insertError } = await supabase
      .from("watchlists")
      .insert({
        name,
        description,
        is_public,
        user_id,
      })
      .select()
      .single()

    if (insertError || !newWatchlist) {
      console.error("Error al crear la watchlist:", insertError?.message)
      return NextResponse.json({ error: "No se pudo crear la lista" }, { status: 500 })
    }

    // Insertar películas si existen movie_ids
    if (Array.isArray(movie_ids) && movie_ids.length > 0) {
      const movieInserts = movie_ids.map((id: string) => ({
        movie_id: id,
        watchlist_id: newWatchlist.id,
      }))

      const { error: movieError } = await supabase.from("watchlist_movies").insert(movieInserts)

      if (movieError) {
        console.error("Error al insertar películas:", movieError.message)
        return NextResponse.json({ error: "Lista creada, pero falló la inserción de películas" }, { status: 500 })
      }
    }

    return NextResponse.json({ watchlist: newWatchlist }, { status: 201 })
  } catch (err) {
    console.error("Error inesperado:", err)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}
