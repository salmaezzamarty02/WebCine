import { Skeleton } from "@/components/ui/skeleton"

export default function FriendsLoading() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-[150px] mb-2" />
          <Skeleton className="h-5 w-[300px]" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[150px]" />
        </div>
      </div>

      <Skeleton className="h-12 w-full mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[72px] w-full rounded-lg" />
          ))}
      </div>
    </div>
  )
}
