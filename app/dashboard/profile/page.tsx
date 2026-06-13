import { cookies } from "next/headers";
import ProfilePage from "../../components/ProfilePage";

export const metadata = {
	title: "Profile Settings | ULADS Portal",
	description: "Manage your personal information and account settings.",
};

export default async function Page() {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
		headers: { Cookie: token ? `jwt=${token.value}` : "" },
		cache: "no-store",
	});

	const user = res.ok ? await res.json() : null;

	return <ProfilePage initialUser={user} />;
}
