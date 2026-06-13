// components/skeletons/AnnouncementSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function AnnouncementSkeleton() {
	return (
		<div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm p-6 space-y-6">
			{[1, 2, 3].map((i) => (
				<div
					key={i}
					className="space-y-3"
				>
					<div className="flex items-center gap-2">
						<Skeleton className="h-4 w-16" />
						<Skeleton className="h-4 w-24" />
					</div>
					<Skeleton className="h-5 w-3/4" />
					<Skeleton className="h-16 w-full" />
				</div>
			))}
		</div>
	);
}
