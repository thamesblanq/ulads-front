import { cookies } from "next/headers";
import DashboardPage from "../components/Dashboard";

export default async function Page() {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	// Fetch both in parallel
	const [userRes, electionRes] = await Promise.all([
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
			headers: { Cookie: token ? `jwt=${token.value}` : "" },
			cache: "no-store",
		}),
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/elections/active`, {
			headers: { Cookie: token ? `jwt=${token.value}` : "" },
			cache: "no-store",
		}),
	]);
	const userText = await userRes.text();
	const electionText = await electionRes.text();

	const user = userRes.ok && userText ? JSON.parse(userText) : null;
	const activeElection =
		electionRes.ok && electionText ? JSON.parse(electionText) : null;

	return (
		<DashboardPage
			initialUser={user}
			initialElection={activeElection}
		/>
	);
}
