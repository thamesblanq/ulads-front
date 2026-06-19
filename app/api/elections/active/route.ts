import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/elections/active`,
			{
				headers: {
					Cookie: token ? `jwt=${token.value}` : "",
				},
				cache: "no-store",
			},
		);

		if (!res.ok) {
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: res.status },
			);
		}

		const data = await res.json();
		return NextResponse.json(data);
	} catch (error) {
		// ✅ Strictly typing and checking the error instance
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
}
