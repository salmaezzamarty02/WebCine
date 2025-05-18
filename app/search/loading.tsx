import { Skeleton } from "@/components/ui/skeleton"

export default function SearchLoading() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <Skeleton className="h-10 w-[150px] mb-6" />

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <Skeleton className="h-10 flex-1" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
      </div>

      <Skeleton className="h-12 w-full mb-8" />

      <div className="space-y-8">
        <div>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item}>
                <Skeleton className="aspect-[2/3] rounded-lg mb-2" />
                <Skeleton className="h-5 w-[80%] mb-1" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center p-4 rounded-lg border border-gray-800">
                <Skeleton className="h-12 w-12 rounded-full mr-4" />
                <div>
                  <Skeleton className="h-5 w-[120px] mb-1" />
                  <Skeleton className="h-4 w-[100px] mb-1" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-6 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="p-4 rounded-lg border border-gray-800">
                <div className="flex justify-between items-start mb-2">
                  <Skeleton className="h-5 w-[250px] mb-1" />
                  <Skeleton className="h-5 w-[80px]" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Skeleton className="h-6 w-6 rounded-full mr-2" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
