import { Metadata } from "next";
import { AnnouncementPage } from "../../components/AnnouncementPage";

// Define metadata for the page
export const metadata: Metadata = {
	title: "Announcements | ULADS Portal",
	description:
		"Stay updated with the latest official announcements and news from the ULADS executive council.",
};

export default function AnnouncementsDashboardPage() {
	return (
		<div className="p-4 lg:p-8">
			<h2 className="text-2xl font-bold text-slate-800 mb-6">Notice Board</h2>
			{/* The component handles the fetching and the UI rendering */}
			<AnnouncementPage />
		</div>
	);
}
