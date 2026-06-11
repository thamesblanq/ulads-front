import React, { Suspense } from "react";
import type { Metadata } from "next";
import ResetPasswordPage from "../components/ResetPasswordPage";

export const metadata: Metadata = {
	title: "Create New Password | ULADS Portal",
	description: "Set a new password for your account.",
};

// Next.js requires components that read URL search params to be wrapped in a Suspense boundary
export default function Page() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen flex items-center justify-center">
					Loading secure form...
				</div>
			}
		>
			<ResetPasswordPage />
		</Suspense>
	);
}
