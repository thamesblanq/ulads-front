// components/skeletons/ElectionSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function ElectionSkeleton() {
	return (
		<div className="max-w-7xl mx-auto py-6 space-y-8">
			{/* Header Skeleton */}
			<div className="space-y-2">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-8 w-64" />
			</div>

			<div className="flex flex-col lg:flex-row gap-8">
				{/* Main Content: Candidates Grid */}
				<div className="w-full lg:w-[70%] grid grid-cols-1 md:grid-cols-2 gap-5">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="bg-white p-6 rounded-2xl flex flex-col items-center gap-4"
						>
							<Skeleton className="w-24 h-24 rounded-full" />
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-4 w-24 rounded-full" />
							<Skeleton className="h-10 w-full rounded-xl" />
						</div>
					))}
				</div>

				{/* Sidebar Widgets */}
				<div className="w-full lg:w-[30%] space-y-5">
					<Skeleton className="h-40 w-full rounded-2xl" />
					<Skeleton className="h-40 w-full rounded-2xl" />
					<Skeleton className="h-40 w-full rounded-2xl" />
				</div>
			</div>
		</div>
	);
}
