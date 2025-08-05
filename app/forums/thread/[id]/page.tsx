//app/forums/thread/id/page
import { getThreadById } from "@/lib/queries"
import { notFound } from "next/navigation"
import ThreadContent from "./ThreadContent"

export const dynamic = "force-dynamic"
export const dynamicParams = true

export default async function ThreadPage({ params }: { params: { id: string } }) {
  const { id } = await params 
  const thread = await getThreadById(id)
  if (!thread) return notFound()

  const replies = thread.forum_comments || []
  const categoryName = Array.isArray(thread.forum_categories)
    ? thread.forum_categories[0]?.name || "Sin categoría"
    : thread.forum_categories?.name || "Sin categoría"
  const threadUser = Array.isArray(thread.user) ? thread.user[0] : thread.user

  return (
    <ThreadContent
      thread={thread}
      replies={replies}
      threadUser={threadUser}
      categoryName={categoryName}
    />
  )
}
