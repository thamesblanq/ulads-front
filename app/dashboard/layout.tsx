import React from "react";
import { cookies } from "next/headers";
import type { Metadata } from "next";
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
	const cookieStore = await cookies();
	const jwt = cookieStore.get("jwt")?.value;

	let email = "";
	// 👇 Default to your enum's base level
	let role = "user";

	if (jwt) {
		try {
			const payloadBase64 = jwt.split(".")[1];
			if (payloadBase64) {
				const decodedPayload = JSON.parse(
					Buffer.from(payloadBase64, "base64").toString(),
				);
				email = decodedPayload.email || "";
				// 👇 Ensure we grab the role and strictly lower case it just in case
				role = (decodedPayload.role || "user").toLowerCase();
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				console.error("Failed to decode token in layout:", error.message);
			}
		}
	}

	return (
		<DashboardLayout
			email={email}
			role={role}
		>
			{children}
		</DashboardLayout>
	);
}
