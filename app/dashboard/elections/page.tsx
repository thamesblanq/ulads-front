import { cookies } from "next/headers";
import { ElectionPage } from "../../components/ElectionPage";

export default async function Page() {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	// 1. Fetch active election
	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/elections/active`,
		{
			headers: { Cookie: token ? `jwt=${token.value}` : "" },
			cache: "no-store",
		},
	);
	const election = res.ok ? await res.json() : null;

	// 2. Fetch voted positions if election exists
	let votedPositions = [];
	if (election?.id) {
		const voteRes = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/elections/${election.id}/has-voted`,
			{
				headers: { Cookie: token ? `jwt=${token.value}` : "" },
				cache: "no-store",
			},
		);
		votedPositions = voteRes.ok ? await voteRes.json() : [];
	}

	return (
		<ElectionPage
			initialElection={election}
			initialVotedPositions={votedPositions}
		/>
	);
}
