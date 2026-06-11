"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token"); // 👈 Grab the token from the URL!

	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!token) {
			toast.error("Invalid or missing recovery token.");
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					// Matching your backend DTO expectations
					body: JSON.stringify({ token, new_password: newPassword }),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to reset password.");
			}

			toast.success("Password successfully updated! You can now log in.");
			router.push("/login");
		} catch (error) {
			console.error("Reset Password Error:", error);
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	// If they landed on this page without a token in the URL, show an error state
	if (!token) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
				<Card className="w-full max-w-md shadow-xl text-center p-8">
					<h2 className="text-red-600 font-bold text-xl mb-2">Invalid Link</h2>
					<p className="text-gray-600 mb-6">
						It looks like your password reset link is invalid or has expired.
					</p>
					<Link href="/forgot-password">
						<Button className="bg-[#0A192F] hover:bg-[#112240]">
							Request New Link
						</Button>
					</Link>
				</Card>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Card className="w-full max-w-md shadow-xl border-gray-100">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-2xl font-bold text-[#0A192F]">
						Set New Password
					</CardTitle>
					<CardDescription>
						Please enter your new password below.
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-5"
					>
						<div className="space-y-2">
							<Label
								htmlFor="new-password"
								className="font-medium"
							>
								New Password
							</Label>
							<Input
								id="new-password"
								type="password"
								placeholder="••••••••"
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
								minLength={8}
								className="focus-visible:ring-[#0A192F]"
							/>
						</div>
						<div className="space-y-2">
							<Label
								htmlFor="confirm-password"
								className="font-medium"
							>
								Confirm Password
							</Label>
							<Input
								id="confirm-password"
								type="password"
								placeholder="••••••••"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
								minLength={8}
								className="focus-visible:ring-[#0A192F]"
							/>
						</div>
						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-[#0A192F] hover:bg-[#112240] text-white h-11 text-base font-semibold"
						>
							{isLoading ? "Updating..." : "Update Password"}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
