import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET() {
  const cookieStore = await cookies()
  const access_token = cookieStore.get("access_token")?.value

  if (!access_token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: { user }, error } = await supabase.auth.getUser(access_token)

  if (error || !user) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 })
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (profileError) {
    return NextResponse.json({ error: "Perfil no encontrado" }, { status: 404 })
  }

  return NextResponse.json({ profile })
}

export async function PATCH(req: Request) {
  const cookieStore = cookies()
  const access_token = (await cookieStore).get("access_token")?.value

  if (!access_token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  const { data: { user }, error } = await supabase.auth.getUser(access_token)

  if (error || !user) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 })
  }

  const body = await req.json()

  const { name, username, bio, avatar, location, website, email } = body

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      name,
      username,
      bio,
      avatar,
      location,
      website,
      email,
    })
    .eq("id", user.id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 400 })
  }

  return NextResponse.json({ message: "Perfil actualizado correctamente" })
}
