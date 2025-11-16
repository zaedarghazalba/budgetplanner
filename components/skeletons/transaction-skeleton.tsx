export function TransactionSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3 p-4 rounded-lg border bg-white animate-pulse"
        >
          {/* Icon */}
          <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex-shrink-0" />

          {/* Content */}
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>

          {/* Amount & Actions */}
          <div className="flex items-center gap-2">
            <div className="h-6 bg-gray-200 rounded w-20" />
            <div className="w-8 h-8 bg-gray-200 rounded" />
            <div className="w-8 h-8 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TransactionPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg">
        <div className="h-8 bg-white/20 rounded w-48 mb-2" />
        <div className="h-4 bg-white/20 rounded w-64" />
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-white p-6 shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
            <div className="h-8 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>

      {/* Transactions List */}
      <div className="rounded-lg border bg-white shadow-lg p-6">
        <div className="h-6 bg-gray-200 rounded w-40 mb-6" />
        <TransactionSkeleton />
      </div>
    </div>
  );
}
