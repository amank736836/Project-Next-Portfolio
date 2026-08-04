'use client';

export default function ProjectSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-6 w-48 animate-pulse" />
          <div className="h-4 w-64 animate-pulse" />
        </div>
        <div className="h-10 w-32 animate-pulse" />
      </div>

      {/* Search Bar Skeleton */}
      <div className="mb-4">
        <div className="h-10 animate-pulse" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {[1,2,3,4,5,6,7,8,10].map(i => (
          <div key={i} className="flex h-32 w-full">
            <div className="h-32 w-full animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 animate-pulse" />
              <div className="h-3 w-1/2 animate-pulse" />
              <div className="flex justify-between pt-3">
                <div className="h-8 w-16 animate-pulse" />
                <div className="h-8 w-8 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}