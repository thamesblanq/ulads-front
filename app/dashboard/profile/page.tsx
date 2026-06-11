import React from "react";
import type { Metadata } from "next";
import ProfilePage from "../../components/ProfilePage"; // Import the Client Component for the profile page

export const metadata: Metadata = {
	title: "Profile Settings | ULADS Portal",
	description: "Manage your personal information and account settings.",
};

export default function Page() {
	return <ProfilePage />;
}
