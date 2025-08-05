//app/api/forums/comments/route
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { thread_id, content } = await req.json()

  // Intentamos obtener el usuario, pero no lo hacemos obligatorio
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Insertamos con o sin user_id (puede ser null)
  const { data, error } = await supabase
    .from("forum_comments")
    .insert({
      thread_id,
      content,
    })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data }, { status: 200 })
}
