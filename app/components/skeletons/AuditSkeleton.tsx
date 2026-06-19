// components/skeletons/AuditSkeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function AuditSkeleton() {
	return (
		<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
			<div className="overflow-x-auto">
				<table className="w-full text-left">
					<thead>
						<tr className="bg-gray-50 border-b border-gray-200">
							{[
								"Timestamp",
								"Operator",
								"Scope",
								"Route",
								"Method",
								"Status",
							].map((header) => (
								<th
									key={header}
									className="px-6 py-3.5"
								>
									<Skeleton className="h-4 w-16" />
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{[1, 2, 3, 4, 5].map((row) => (
							<tr key={row}>
								<td className="px-6 py-4">
									<Skeleton className="h-4 w-32" />
								</td>
								<td className="px-6 py-4">
									<Skeleton className="h-4 w-24" />
								</td>
								<td className="px-6 py-4">
									<Skeleton className="h-4 w-20" />
								</td>
								<td className="px-6 py-4">
									<Skeleton className="h-4 w-28" />
								</td>
								<td className="px-6 py-4">
									<Skeleton className="h-4 w-12" />
								</td>
								<td className="px-6 py-4 flex justify-center">
									<Skeleton className="h-6 w-12 rounded-full" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between">
				<Skeleton className="h-4 w-32" />
				<div className="flex gap-2">
					<Skeleton className="h-8 w-16" />
					<Skeleton className="h-8 w-16" />
				</div>
			</div>
		</div>
	);
}
