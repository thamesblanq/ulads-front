// app/dashboard/profile/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function Loading() {
	return (
		<div className="max-w-3xl mx-auto space-y-8 p-4">
			{/* Profile Card Skeleton */}
			<Card className="border-slate-200 shadow-sm">
				<CardHeader>
					<Skeleton className="h-8 w-1/3 mb-2" />
					<Skeleton className="h-4 w-2/3" />
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
					<Skeleton className="h-10 w-32" />
				</CardContent>
			</Card>

			{/* Danger Zone Skeleton */}
			<Card className="border-red-200">
				<CardHeader>
					<Skeleton className="h-6 w-1/4" />
					<Skeleton className="h-4 w-full" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-10 w-40" />
				</CardContent>
			</Card>
		</div>
	);
}
