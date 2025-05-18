import { Skeleton } from "@/components/ui/skeleton"

export default function EditProfileLoading() {
  return (
    <div className="container py-8 px-4 md:px-6">
      <div className="mb-6">
        <Skeleton className="h-6 w-24" />
      </div>

      <div className="mb-8">
        <Skeleton className="h-10 w-[200px] mb-2" />
        <Skeleton className="h-6 w-[300px]" />
      </div>

      <div className="space-y-8">
        {/* Cover Image Section */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-48 md:h-64 rounded-lg" />
          <Skeleton className="h-4 w-[400px]" />
        </div>

        {/* Profile Picture Section */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-[180px]" />
          <div className="flex items-center gap-6">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-[80%] mb-3" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-[120px]" />
                <Skeleton className="h-9 w-[120px]" />
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-[180px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-4 w-[150px]" />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-4 w-[150px]" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-[180px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
              <div className="flex flex-wrap gap-2 mt-2">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-6 w-24 rounded-full" />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Skeleton className="h-5 w-[100px]" />
              <Skeleton className="h-10 w-full" />
              <div className="flex flex-wrap gap-2 mt-2">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-6 w-32 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-[180px]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-[100px]" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[100px]" />
            <Skeleton className="h-10 w-[150px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
