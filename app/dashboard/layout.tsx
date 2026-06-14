import React from "react";
import type { Metadata } from "next";
import { cookies } from "next/headers";
import DashboardLayout from "../components/DashboardLayout";

export const metadata: Metadata = {
	title: "Student Dashboard | ULADS Portal",
	description:
		"Access your ULADS resources, announcements, and portal features.",
};

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	// 1. Get the session cookie
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	// 2. Fetch User Data on the Server
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
		headers: {
			Cookie: token ? `jwt=${token.value}` : "",
		},
		cache: "no-store", // Ensure we always get fresh data
	});

	// 3. If unauthorized, the DashboardLayout will handle the redirection
	// or you can handle it here by returning a login redirect
	const text = await res.text();
	const user = res.ok && text ? JSON.parse(text) : null;

	return <DashboardLayout initialUser={user}>{children}</DashboardLayout>;
}
