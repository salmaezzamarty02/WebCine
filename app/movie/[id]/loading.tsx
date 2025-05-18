import { Skeleton } from "@/components/ui/skeleton"

export default function MovieLoading() {
  return (
    <div>
      {/* Movie Hero Skeleton */}
      <div className="relative h-[50vh] md:h-[70vh] bg-gray-900">
        <Skeleton className="absolute inset-0" />

        <div className="container relative h-full flex items-end pb-8 px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 w-full">
            <Skeleton className="w-32 md:w-48 h-48 md:h-72 rounded-lg shadow-lg" />

            <div className="flex-1">
              <Skeleton className="h-10 w-3/4 md:w-1/2 mb-2" />
              <Skeleton className="h-5 w-1/2 md:w-1/3 mb-2" />

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Skeleton className="h-6 w-16" />
                <div className="h-6 border-l border-gray-600"></div>
                <Skeleton className="h-6 w-16" />
                <div className="h-6 border-l border-gray-600"></div>
                <div className="flex gap-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-6 w-24 rounded-full" />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <Skeleton className="h-6 w-24" />
                <div className="h-6 border-l border-gray-600"></div>
                <Skeleton className="h-6 w-32" />
              </div>

              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-36" />
                <Skeleton className="h-10 w-10 rounded-md" />
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Content Skeleton */}
      <div className="container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Skeleton */}
          <div className="lg:col-span-2">
            <Skeleton className="h-12 w-full mb-6" />

            <div className="space-y-8">
              {/* Synopsis Skeleton */}
              <div>
                <Skeleton className="h-8 w-[150px] mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>

              {/* Cast Skeleton */}
              <div>
                <Skeleton className="h-8 w-[150px] mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-24 mb-1" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Crew Skeleton */}
              <div>
                <Skeleton className="h-8 w-[150px] mb-4" />
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Skeleton className="h-5 w-24 mb-1" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className="space-y-8">
            {/* Similar Movies Skeleton */}
            <div>
              <Skeleton className="h-6 w-[180px] mb-4" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="aspect-[2/3] rounded-md w-full" />
                    <Skeleton className="h-5 w-[80%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Collections Skeleton */}
            <Skeleton className="h-[150px] rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
