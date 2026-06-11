// app/login/page.tsx
import React from "react";
import type { Metadata } from "next"; // 👈 Import Next.js Metadata type
import LoginPage from "../components/Login"; // 👈 Import the Login component

// 👇 Export your SEO Metadata right here!
export const metadata: Metadata = {
	title: "Login | ULADS Portal",
	description:
		"Sign in to access your University of Lagos Association of Dental Students dashboard.",
};

export default function Page() {
	return <LoginPage />;
}
