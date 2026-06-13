import { Metadata } from "next";
import { cookies } from "next/headers";
import { AnnouncementPage } from "../../components/AnnouncementPage";

export const metadata: Metadata = {
	title: "Announcements | ULADS Portal",
	description: "Stay updated with the latest official announcements and news.",
};

export default async function AnnouncementsDashboardPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	// Fetch announcements on the server
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements`, {
		headers: { Cookie: token ? `jwt=${token.value}` : "" },
		cache: "no-store",
	});

	const data = res.ok ? await res.json() : [];
	// Handle cases where data might be { data: [...] } or just an array
	const announcements = Array.isArray(data) ? data : data.data || [];

	return (
		<div className="p-4 lg:p-8">
			<h2 className="text-2xl font-bold text-slate-800 mb-6">Notice Board</h2>
			<AnnouncementPage initialAnnouncements={announcements} />
		</div>
	);
}
