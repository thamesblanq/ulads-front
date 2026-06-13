// app/dashboard/announcements/loading.tsx
import { AnnouncementSkeleton } from "../../components/AnnouncementSkeleton";

export default function Loading() {
	return (
		<div className="p-4 lg:p-8">
			{/* Title skeleton */}
			<div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg mb-6" />

			{/* Announcement list skeletons */}
			<AnnouncementSkeleton />
		</div>
	);
}
