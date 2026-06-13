import { Metadata } from "next";
import { ElectionPage } from "../../components/ElectionPage";

export const metadata: Metadata = {
	title: "Live Elections | ULADS Portal",
	description:
		"Cast your vote for the upcoming executive council elections securely.",
};

export default function ElectionsDashboardPage() {
	return <ElectionPage />;
}
