import { Skeleton } from "@/components/ui/skeleton"

export default function NotificationsLoading() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-[200px] mb-2" />
          <Skeleton className="h-5 w-[300px]" />
        </div>

        <Skeleton className="h-10 w-[180px]" />
      </div>

      <Skeleton className="h-12 w-full mb-8" />

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-4 rounded-lg border border-gray-800">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />

              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="flex-1">
                    <Skeleton className="h-5 w-full max-w-[400px] mb-2" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>

                  <div className="flex items-start gap-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <Skeleton className="h-9 w-[120px] rounded-md" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
