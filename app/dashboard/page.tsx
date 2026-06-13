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

	const user = userRes.ok ? await userRes.json() : null;
	const activeElection = electionRes.ok ? await electionRes.json() : null;

	return (
		<DashboardPage
			initialUser={user}
			initialElection={activeElection}
		/>
	);
}
