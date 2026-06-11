import React from "react";
import type { Metadata } from "next";
import AdminDashboard from "../../components/AdminDashboard";

export const metadata: Metadata = {
	title: "Superadmin Dashboard | ULADS Portal",
	description: "Manage users, assign roles, and monitor system activity.",
};

export default function Page() {
	return <AdminDashboard />;
}
