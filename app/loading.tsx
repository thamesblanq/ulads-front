// app/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
	return (
		<div className="min-h-screen bg-white">
			{/* Navbar Skeleton */}
			<div className="h-20 border-b border-gray-100 flex items-center px-8">
				<Skeleton className="h-8 w-32" />
			</div>

			{/* Hero Skeleton */}
			<div className="max-w-7xl mx-auto px-8 py-24 grid lg:grid-cols-2 gap-16">
				<div className="space-y-6">
					<Skeleton className="h-16 w-3/4" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-14 w-48" />
				</div>
				<Skeleton className="h-125 w-full rounded-2xl" />
			</div>
		</div>
	);
}
