import { Skeleton } from "@/components/ui/skeleton"

export default function EventsLoading() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-[150px] mb-2" />
          <Skeleton className="h-5 w-[250px]" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>

      <Skeleton className="h-12 w-full mb-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="rounded-lg border border-gray-800 overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <div className="p-5">
              <div className="flex justify-between items-start mb-4">
                <Skeleton className="h-6 w-[200px]" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>

              <Skeleton className="h-4 w-full mb-4" />
              <Skeleton className="h-4 w-full mb-4" />

              <div className="space-y-2 mb-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-[150px]" />
              </div>

              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
