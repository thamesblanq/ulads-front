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

		// 1. If backend returns an error (401, 404, 500), pass the EXACT status to the frontend
		if (!res.ok) {
			const errorText = await res.text();
			return NextResponse.json(
				{ error: errorText || "Backend returned an error" },
				{ status: res.status },
			);
		}

		// 2. SAFELY parse the data. If the backend returns empty (204), don't crash!
		const text = await res.text();
		const data = text ? JSON.parse(text) : null;

		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "An unexpected error occurred" },
			{ status: 500 },
		);
	}
}
