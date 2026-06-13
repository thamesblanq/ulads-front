import React from "react";
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
	return <DashboardLayout>{children}</DashboardLayout>;
}
