import { Skeleton } from "@/components/ui/skeleton"

export default function MoviesLoading() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-[150px] mb-2" />
          <Skeleton className="h-5 w-[250px]" />
        </div>

        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="hidden md:block w-[250px] shrink-0">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-6 w-[150px] mb-3" />
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>

            <Skeleton className="h-10 w-full" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="h-10 w-[180px]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[2/3] rounded-md w-full" />
                  <Skeleton className="h-5 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                </div>
              ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Skeleton className="h-10 w-[180px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
