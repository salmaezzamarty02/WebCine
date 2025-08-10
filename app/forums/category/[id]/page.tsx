import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import CategoryThreadsTabs from "./CategoryThreadsTabs"
import {
  getForumCategoryById,
  getThreadsByCategorySimple,
  getCategoryParticipants,
  getTopThreadsByCommentsForCategory,
} from "@/lib/queries"

export default async function ForumCategoryPage({ params }: { params: { id: string } }) {
  const categoryId = params.id

  const [category, threads, participants, popular] = await Promise.all([
    getForumCategoryById(categoryId),
    getThreadsByCategorySimple(categoryId),
    getCategoryParticipants(categoryId),
    getTopThreadsByCommentsForCategory(categoryId, 5),
  ])

  const threadsCount = threads.length
  const repliesCount = threads.reduce((acc, t) => acc + t.replies, 0)
  const activeMembersCount = participants.length

  // Derivados para pestañas
  const recent = threads.slice().sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )
  const unanswered = threads.filter(t => t.replies === 0)

  return (
    <div className="container py-8 px-4 md:px-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/forums">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Foros
          </Link>
        </Button>
        <div className="text-gray-400">/</div>
        <span className="text-sm font-medium">{category?.name ?? categoryId}</span>
      </div>

      {/* Header + CTA */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{category?.name ?? categoryId}</h1>
          <p className="text-gray-400">Debates de la categoría</p>
        </div>

        <Button asChild>
          <Link href="/forums/new">Nuevo tema</Link>
        </Button>
      </div>

      {/* Stats (sin Vistas) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="rounded-lg border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary">{threadsCount}</div>
          <div className="text-sm text-gray-400">Temas</div>
        </div>
        <div className="rounded-lg border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary">{repliesCount}</div>
          <div className="text-sm text-gray-400">Respuestas</div>
        </div>
        <div className="rounded-lg border border-gray-800 p-4 text-center">
          <div className="text-2xl font-bold text-primary">{activeMembersCount}</div>
          <div className="text-sm text-gray-400">Miembros activos</div>
        </div>
      </div>

      {/* Tabs: Recientes / Populares / Sin responder */}
      <CategoryThreadsTabs recent={recent} popular={popular} unanswered={unanswered} />

      {/* Miembros activos */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">Miembros activos en esta categoría</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {participants.map((m) => (
            <Link
              key={m.id}
              href={`/profile/${m.id}`}
              className="flex flex-col items-center p-4 rounded-lg border border-gray-800 hover:bg-card/80 transition-colors"
            >
              <Avatar className="h-12 w-12 mb-2">
                <AvatarImage src={m.avatar || "/placeholder.svg"} alt={m.name ?? m.username ?? "Usuario"} />
                <AvatarFallback>{(m.username ?? m.name ?? "U").substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-sm font-medium text-center">{m.name ?? m.username ?? "Usuario"}</div>
            </Link>
          ))}

          {participants.length === 0 && (
            <div className="col-span-full p-6 text-center text-gray-400 border border-gray-800 rounded-lg">
              Aún no hay participantes.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
