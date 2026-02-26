import { CardSkeleton } from "@/components/skeletons/card-skeleton";

export default function Loading() {
    return (
        <div className="space-y-6">
            {/* Header Skeleton */}
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 -m-3 sm:-m-4 md:-m-6 mb-4 sm:mb-6 p-4 sm:p-6 rounded-lg shadow-lg animate-pulse">
                <div className="h-8 bg-white/20 rounded w-48 mb-2" />
                <div className="h-4 bg-white/10 rounded w-64" />
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <CardSkeleton key={i} />
                ))}
            </div>

            {/* Budget List Skeleton */}
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-lg border bg-card p-6 shadow-sm animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                                <div>
                                    <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                                    <div className="h-3 bg-gray-100 rounded w-24" />
                                </div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-24" />
                        </div>
                        <div className="h-3 bg-gray-100 rounded-full w-full mb-2" />
                        <div className="flex justify-between">
                            <div className="h-3 bg-gray-100 rounded w-20" />
                            <div className="h-3 bg-gray-100 rounded w-20" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
