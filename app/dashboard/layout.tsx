import React from "react";
import type { Metadata } from "next";
import DashboardLayout from "../components/DashboardLayout";

export const metadata: Metadata = {
	title: "Student Dashboard | ULADS Portal",
	description:
		"Access your ULADS resources, announcements, and portal features.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
	// 🧹 Cleaned up! No more server-side fetching holding up the UI.
	// The Client Component will now handle fetching its own data.
	return <DashboardLayout>{children}</DashboardLayout>;
}
