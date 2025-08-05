//app/api/forums/route.ts
import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabaseServer"

export async function POST(req: Request) {
  const supabase = await createClient()
  const body = await req.json()

  const { title, content, category_id, user_id, tags } = body

  // 1. Crear el hilo en forum_threads
  const { data: thread, error: threadError } = await supabase
    .from("forum_threads")
    .insert({
      title,
      content,
      category_id,
      user_id
    })
    .select()
    .single()

  if (threadError) {
    console.error("Error creando el hilo:", threadError.message)
    return NextResponse.json({ error: threadError.message }, { status: 500 })
  }

  // 2. Insertar etiquetas si hay
  if (tags?.length > 0) {
    const tagsToInsert = tags.map((name: string) => ({
      thread_id: thread.id,
      name
    }))

    const { error: tagsError } = await supabase
      .from("forum_tags")
      .insert(tagsToInsert)

    if (tagsError) {
      console.error("Error insertando etiquetas:", tagsError.message)
    }
  }

  return NextResponse.json({ id: thread.id }, { status: 201 })
}
