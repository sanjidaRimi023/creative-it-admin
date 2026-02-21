export default function SkeletonLoading() {
  return (
    <>
      <div className="space-y-8 h-full animate-in fade-in duration-300">
        {/* Welcome Section Skeleton */}
        <div className="bg-sidebar-accent/50 border border-border rounded-2xl p-8 h-40 animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-muted rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-2xl border border-border p-6 shadow-sm h-35 animate-pulse flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-3 w-full">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-10 w-16 bg-muted rounded"></div>
                </div>
                <div className="h-12 w-12 bg-muted rounded-xl shrink-0"></div>
              </div>
              <div className="h-4 w-32 bg-muted rounded mt-4"></div>
            </div>
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm h-45 animate-pulse">
          <div className="h-6 bg-muted rounded w-1/4 mb-6"></div>
          <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
          <div className="h-10 bg-muted rounded w-40"></div>
        </div>
      </div>
    </>
  );
}
