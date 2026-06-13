"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // Added eye icons
import { z } from "zod"; // Using Zod for consistency
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

const passwordSchema = z
	.string()
	.min(8, "Password must be at least 8 characters.");

export default function ResetPasswordPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");

	const [showPassword, setShowPassword] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// 1. Zod Validation
		const result = passwordSchema.safeParse(newPassword);
		if (!result.success) {
			toast.error(result.error.issues[0].message);
			return;
		}

		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`api/auth/reset-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ token, new_password: newPassword }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to reset password.");
			}

			toast.success("Password successfully updated!");
			router.push("/login");
		} catch (err: unknown) {
			toast.error(
				err instanceof Error ? err.message : "An unexpected error occurred.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
			<Card className="w-full max-w-md shadow-xl border-gray-100">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold text-[#0A192F]">
						Set New Password
					</CardTitle>
					<CardDescription>
						Secure your account with a new password.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-5"
					>
						<div className="space-y-2 relative">
							<Label htmlFor="new-password">New Password</Label>
							<Input
								id="new-password"
								type={showPassword ? "text" : "password"}
								value={newPassword}
								onChange={(e) => setNewPassword(e.target.value)}
								required
							/>
							{/* Toggle visibility */}
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-9 text-gray-400"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>

						<div className="space-y-2">
							<Label htmlFor="confirm-password">Confirm Password</Label>
							<Input
								id="confirm-password"
								type="password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
								required
							/>
						</div>

						<Button
							type="submit"
							className="w-full bg-[#0A192F]"
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="animate-spin mr-2" />
							) : (
								"Update Password"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
