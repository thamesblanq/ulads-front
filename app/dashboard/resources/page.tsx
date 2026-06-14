import { Metadata } from "next";
import { cookies } from "next/headers";
import { ResourcePage } from "../../components/ResourcePage";

export const metadata: Metadata = {
	title: "Academic Resources | ULADS Portal",
	description: "Access study materials, past questions, and lecture notes.",
};

export default async function ResourcesDashboardPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	// Fetch the real resources from your API
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/resources`, {
		headers: { Cookie: token ? `jwt=${token.value}` : "" },
		cache: "no-store",
	});

	const text = await res.text();
	const resources = res.ok && text ? JSON.parse(text) : [];

	return <ResourcePage initialResources={resources} />;
}
