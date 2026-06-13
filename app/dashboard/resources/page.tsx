import { Metadata } from "next"; // 👈 Import Metadata type
import { ResourcePage } from "../../components/ResourcePage"; // 👈 Import the ResourcePage component

// 1. Define the metadata for this specific page
export const metadata: Metadata = {
	title: "Academic Resources | ULADS Portal",
	description:
		"Access study materials, past questions, and lecture notes for all levels.",
};

// 2. Export your page component
export default function ResourcesDashboardPage() {
	return <ResourcePage />;
}
