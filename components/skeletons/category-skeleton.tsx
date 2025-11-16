export function CategorySkeleton() {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 rounded-xl border-2 bg-white animate-pulse"
        >
          {/* Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 shadow-sm flex-shrink-0" />

          {/* Info */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>

          {/* Actions */}
          <div className="flex gap-1">
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="w-8 h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="h-8 bg-white/20 rounded w-32 mb-2" />
        <div className="h-4 bg-white/20 rounded w-48" />
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-16" />
          </div>
        ))}
      </div>

      {/* Category Lists */}
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white shadow-lg p-6">
            <div className="h-6 bg-gray-200 rounded w-48 mb-6" />
            <CategorySkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}
