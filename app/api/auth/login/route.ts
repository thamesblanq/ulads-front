import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();

		// 1. Forward the login request to your NestJS backend
		const backendResponse = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
			},
		);

		if (!backendResponse.ok) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: backendResponse.status },
			);
		}

		// 2. Grab the specific Set-Cookie header NestJS sent back
		const cookieHeader = backendResponse.headers.get("set-cookie");

		// 3. Create a success response for your frontend
		const response = NextResponse.json({ success: true });

		// 4. THE MAGIC: Attach the cookie to the Next.js response.
		// This forces the browser to save the cookie under your Next.js frontend domain!
		if (cookieHeader) {
			response.headers.set("set-cookie", cookieHeader);
		}

		return response;
	} catch (error) {
		console.error("Error in login route:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
