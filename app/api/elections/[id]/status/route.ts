import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(
	request: Request,
	{ params }: { params: Promise<{ id: string }> }, // Next.js 15 requires awaiting params
) {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");
	const resolvedParams = await params;

	try {
		const body = await request.json();

		const res = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/elections/${resolvedParams.id}/status`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Cookie: token ? `jwt=${token.value}` : "",
				},
				body: JSON.stringify(body),
			},
		);

		if (!res.ok) {
			const errorText = await res.text();
			return NextResponse.json(
				{ error: errorText || "Failed to update election status" },
				{ status: res.status },
			);
		}

		const data = await res.json();
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
