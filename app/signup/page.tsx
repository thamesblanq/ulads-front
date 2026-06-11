import React from "react";
import type { Metadata } from "next";
import SignUpPage from "../components/SignUp"; // 👈 Import the SignUp component

export const metadata: Metadata = {
	title: "Sign Up | ULADS Portal",
	description:
		"Create your student account for the University of Lagos Association of Dental Students portal.",
};

export default function Page() {
	return <SignUpPage />;
}
