import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileLoading() {
  return (
    <div>
      {/* Profile Header Skeleton */}
      <div className="relative">
        <div className="h-48 md:h-64 relative bg-gray-900">
          <Skeleton className="absolute inset-0" />
        </div>

        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-16 md:-mt-20">
            <Skeleton className="h-32 w-32 rounded-full border-4 border-background" />

            <div className="flex-1 text-center md:text-left">
              <Skeleton className="h-8 w-[200px] mb-2 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-[150px] mx-auto md:mx-0" />
            </div>

            <div className="flex flex-wrap gap-2 justify-center md:justify-end">
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-[120px]" />
            </div>
          </div>

          <div className="mt-6 mb-8">
            <Skeleton className="h-4 w-full max-w-3xl mb-4" />
            <Skeleton className="h-4 w-full max-w-2xl mb-4" />
            <Skeleton className="h-4 w-full max-w-xl" />

            <div className="flex flex-wrap items-center gap-4 text-sm mt-6">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Profile Content Skeleton */}
      <div className="container py-8 px-4 md:px-6">
        <Skeleton className="h-12 w-full mb-8" />

        <div className="space-y-8">
          <div>
            <Skeleton className="h-8 w-[200px] mb-4" />
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div>
            <Skeleton className="h-8 w-[200px] mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[2/3] rounded-md w-full" />
                  <Skeleton className="h-5 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
