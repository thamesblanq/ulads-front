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
	const text = await res.text();
	const election = res.ok && text ? JSON.parse(text) : null;

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
		const voteText = await voteRes.text();
		votedPositions = voteRes.ok && voteText ? JSON.parse(voteText) : [];
	}

	return (
		<ElectionPage
			initialElection={election}
			initialVotedPositions={votedPositions}
		/>
	);
}
