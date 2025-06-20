import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET() {
 const cookieStore = await cookies()  
  const access_token = cookieStore.get("access_token")?.value

  if (!access_token) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })
  }

  // Autenticación usando el token manualmente
  const { data: { user }, error } = await supabase.auth.getUser(access_token)

  if (error || !user) {
    return NextResponse.json({ error: "Sesión no válida" }, { status: 401 })
  }

  // Obtener perfil desde la tabla `profiles`
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
