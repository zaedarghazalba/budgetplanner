export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
                <div className="h-8 bg-white/20 rounded w-48 mb-2" />
                <div className="h-4 bg-white/10 rounded w-64" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Sidebar Skeleton */}
                <div className="space-y-2">
                    <div className="rounded-lg border bg-card p-4 shadow-sm animate-pulse">
                        <div className="space-y-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded-lg" />
                            ))}
                        </div>
                    </div>
                    <div className="rounded-lg border bg-card p-6 shadow-sm animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-32 mb-4" />
                        <div className="space-y-3">
                            <div>
                                <div className="h-3 bg-gray-100 rounded w-12 mb-1" />
                                <div className="h-4 bg-gray-200 rounded w-48" />
                            </div>
                            <div>
                                <div className="h-3 bg-gray-100 rounded w-16 mb-1" />
                                <div className="h-4 bg-gray-200 rounded w-24" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Skeleton */}
                <div className="md:col-span-2">
                    <div className="rounded-lg border bg-card p-6 shadow-sm animate-pulse">
                        <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                        <div className="h-3 bg-gray-100 rounded w-64 mb-8" />
                        <div className="space-y-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i}>
                                    <div className="h-3 bg-gray-100 rounded w-24 mb-2" />
                                    <div className="h-10 bg-gray-200 rounded w-full" />
                                </div>
                            ))}
                            <div className="h-10 bg-indigo-200 rounded w-32" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
