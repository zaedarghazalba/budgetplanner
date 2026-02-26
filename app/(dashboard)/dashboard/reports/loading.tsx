import { CardSkeleton } from "@/components/skeletons/card-skeleton";

export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
                <div className="h-8 bg-white/20 rounded w-48 mb-2" />
                <div className="h-4 bg-white/10 rounded w-64" />
            </div>

            {/* Filter Skeleton */}
            <div className="rounded-lg border bg-card p-4 shadow-sm animate-pulse">
                <div className="flex gap-3">
                    <div className="h-10 bg-gray-200 rounded w-32" />
                    <div className="h-10 bg-gray-200 rounded w-32" />
                    <div className="h-10 bg-gray-200 rounded w-32" />
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>

            {/* Chart Skeleton */}
            <div className="rounded-lg border bg-card p-6 shadow-sm animate-pulse">
                <div className="h-5 bg-gray-200 rounded w-40 mb-6" />
                <div className="h-64 bg-gray-100 rounded" />
            </div>
        </div>
    );
}
