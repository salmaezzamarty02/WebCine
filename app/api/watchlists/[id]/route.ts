// app/api/watchlists/[id]/route.ts
import { supabase } from "@/lib/supabaseClient"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"


export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const watchlistId = params.id

  const cookieStore = await cookies()
  const access_token = cookieStore.get("access_token")?.value

  if (!access_token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getUser(access_token)

  if (sessionError || !sessionData.user) {
    return NextResponse.json({ error: "Sesión inválida" }, { status: 401 })
  }

  // Eliminar la watchlist
  const { error } = await supabase
    .from("watchlists")
    .delete()
    .eq("id", watchlistId)
    .eq("user_id", sessionData.user.id) // seguridad: que solo borre las suyas

  if (error) {
    console.error("Error al eliminar watchlist:", error.message)
    return NextResponse.json({ error: "No se pudo eliminar la lista" }, { status: 500 })
  }

  return NextResponse.json({ message: "Lista eliminada con éxito" }, { status: 200 })
}