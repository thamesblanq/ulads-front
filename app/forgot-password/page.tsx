import React from "react";
import type { Metadata } from "next";
import ForgotPasswordPage from "../components/ForgotPasswordPage";

export const metadata: Metadata = {
	title: "Forgot Password | ULADS Portal",
	description: "Recover access to your ULADS student account.",
};

export default function Page() {
	return <ForgotPasswordPage />;
}
