import { Skeleton } from "@/components/ui/skeleton"

export default function SettingsLoading() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <Skeleton className="h-10 w-[200px] mb-2" />
          <Skeleton className="h-5 w-[300px]" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-64 shrink-0">
          <Skeleton className="h-10 w-full mb-1" />
          <Skeleton className="h-10 w-full mb-1" />
          <Skeleton className="h-10 w-full mb-1" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex-1">
          <div className="rounded-lg border border-gray-800 p-6">
            <Skeleton className="h-8 w-[200px] mb-6" />

            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Skeleton className="h-24 w-24 rounded-full" />

                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full max-w-[400px] mb-1" />
                  <Skeleton className="h-4 w-full max-w-[300px] mb-3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-[120px]" />
                    <Skeleton className="h-9 w-[120px]" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[100px] mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-[100px] mb-1" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-[100px] mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-5 w-[100px] mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Skeleton className="h-5 w-[100px] mb-1" />
                  <Skeleton className="h-10 w-full" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Skeleton className="h-5 w-[100px] mb-1" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-4 w-[150px]" />
                </div>
              </div>

              <div className="flex justify-end">
                <Skeleton className="h-10 w-[150px]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
