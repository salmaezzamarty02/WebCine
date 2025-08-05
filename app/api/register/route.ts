// app/api/register/route.ts
import { supabase } from "@/lib/supabaseClient"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  console.log("[REGISTER] Endpoint alcanzado")

  const body = await req.json()
  const { name, username, email, password } = body

  console.log("[REGISTER] name:", name)
  console.log("[REGISTER] username:", username)
  console.log("[REGISTER] email:", email)

  // 1. Registro en auth.users
  const {
    data: { user },
    error: signUpError,
  } = await supabase.auth.signUp({
    email,
    password,
  })

  if (signUpError || !user) {
    console.error("[REGISTER] Error en signUp:", signUpError)
    return NextResponse.json({ error: signUpError?.message || "Error desconocido" }, { status: 400 })
  }

  console.log("[REGISTER] Usuario creado con ID:", user.id)

  // 2. Comprobamos si ya existe un perfil con ese ID
  const { data: existingProfile, error: fetchError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .single()

  if (fetchError && fetchError.code !== "PGRST116") {
    console.error("[REGISTER] Error al buscar perfil:", fetchError)
    return NextResponse.json({ error: fetchError.message }, { status: 400 })
  }

  if (!existingProfile) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      name,
      username,
      email,
    })

    if (profileError) {
      console.error("[REGISTER] Error al crear perfil:", profileError)
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    console.log("[REGISTER] Perfil creado correctamente.")
  } else {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ name, username, email })
      .eq("id", user.id)

    if (updateError) {
      console.error("[REGISTER] Error al actualizar perfil:", updateError)
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    console.log("[REGISTER] Perfil actualizado correctamente.")
  }

  return NextResponse.json({ message: "Registro exitoso" }, { status: 200 })
}
