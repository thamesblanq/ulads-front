import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	try {
		const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
			headers: {
				Cookie: token ? `jwt=${token.value}` : "",
			},
			cache: "no-store",
		});

		if (!res.ok) {
			const errorText = await res.text();
			return NextResponse.json(
				{ error: errorText || "Backend returned an error" },
				{ status: res.status },
			);
		}

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
