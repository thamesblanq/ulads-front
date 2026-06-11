import React from "react";
import type { Metadata } from "next";
import DashboardPage from "../components/Dashboard";

export const metadata: Metadata = {
	title: "Student Dashboard | ULADS Portal",
	description:
		"View your recent announcements, election status, and portal notifications.",
};

export default function Page() {
	return <DashboardPage />;
}
