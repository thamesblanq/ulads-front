// components/skeletons/AdminDashboardSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function AdminDashboardSkeleton() {
	return (
		<div className="max-w-7xl mx-auto space-y-12 py-4">
			{/* User Management Section Skeleton */}
			<div className="space-y-4">
				<Skeleton className="h-8 w-64" />
				<Skeleton className="h-12 w-full max-w-2xl" />
			</div>

			{/* Elections Core Logistics Skeleton */}
			<div className="pt-8 border-t space-y-6">
				<Skeleton className="h-6 w-48" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<Skeleton className="h-64 w-full rounded-2xl" />
					<Skeleton className="h-64 w-full rounded-2xl" />
				</div>
			</div>

			{/* Resources & Audit Logs Skeletons */}
			<div className="pt-8 border-t space-y-6">
				<Skeleton className="h-48 w-full rounded-xl" />
			</div>
			<div className="pt-8 border-t space-y-6">
				<Skeleton className="h-64 w-full rounded-xl" />
			</div>
		</div>
	);
}
