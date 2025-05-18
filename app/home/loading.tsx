import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed Skeleton */}
        <div className="lg:col-span-2 space-y-8">
          <Skeleton className="h-12 w-full mb-6" />

          {/* Activity Feed Skeletons */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-gray-800 bg-card overflow-hidden">
              <div className="p-4 flex items-start">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-[180px] mb-2" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>

              <div className="px-4 pb-4">
                <div className="flex items-start mb-3">
                  <Skeleton className="w-16 h-24 rounded-md mr-3" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-[150px] mb-2" />
                    <Skeleton className="h-4 w-[120px] mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-[80%]" />
                  </div>
                </div>

                <Skeleton className="h-[1px] w-full my-4" />

                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Skeletons */}
        <div className="space-y-8">
          {/* Trending Movies Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="w-12 h-18 rounded-md mr-3" />
                  <div>
                    <Skeleton className="h-4 w-[120px] mb-1" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Movies Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="w-12 h-18 rounded-md mr-3" />
                  <div>
                    <Skeleton className="h-4 w-[120px] mb-1" />
                    <Skeleton className="h-3 w-[80px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events Skeleton */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-6 w-[150px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-gray-800 overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <div className="p-3">
                    <Skeleton className="h-5 w-[80%] mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-[60%] mb-2" />
                    <Skeleton className="h-[1px] w-full my-2" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-[100px]" />
                      <Skeleton className="h-8 w-[80px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
