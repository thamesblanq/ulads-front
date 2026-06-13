import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	// 1. Get the token from the cookie
	const token = request.cookies.get("jwt");

	// 2. Define protected routes (routes that need a login)
	const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
	const isAuthRoute =
		request.nextUrl.pathname === "/login" ||
		request.nextUrl.pathname === "/signup";

	// 3. If no token and trying to reach dashboard, kick them to login
	if (!token && isDashboardRoute) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// 4. If token exists and they are trying to login/signup, kick them to dashboard
	if (token && isAuthRoute) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

// 5. Tell middleware which paths to run on
export const config = {
	matcher: ["/dashboard/:path*", "/login", "/signup"],
};
