// components/skeletons/DashboardShellSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardShellSkeleton() {
	return (
		<div className="space-y-6 p-8">
			{/* Simulate your header/nav layout */}
			<div className="flex justify-between">
				<Skeleton className="h-8 w-1/4" />
				<Skeleton className="h-8 w-8 rounded-full" />
			</div>
			{/* Simulate content area */}
			<Skeleton className="h-[60vh] w-full rounded-xl" />
		</div>
	);
}
