import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	try {
		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/elections/all`,
			{
				headers: {
					Cookie: token ? `jwt=${token.value}` : "",
				},
				cache: "no-store",
			},
		);

		if (!res.ok) {
			const errorText = await res.text();
			return NextResponse.json(
				{ error: errorText || "Failed to fetch elections" },
				{ status: res.status },
			);
		}

		const text = await res.text();
		const data = text ? JSON.parse(text) : [];
		return NextResponse.json(data);
	} catch (error) {
		if (error instanceof Error) {
			return NextResponse.json({ error: error.message }, { status: 500 });
		}
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
