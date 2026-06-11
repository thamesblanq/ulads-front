"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email }),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to process request.");
			}

			// Show success state UI
			setIsSubmitted(true);
			toast.success("Recovery link sent! Please check your email.");
		} catch (error) {
			console.error("Forgot Password Error:", error);
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 relative">
			<div className="absolute top-8 left-4 sm:left-8">
				<Link
					href="/login"
					className="flex items-center text-sm font-medium text-gray-500 hover:text-[#0A192F] transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Login
				</Link>
			</div>

			<Card className="w-full max-w-md shadow-xl border-gray-100">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-2xl font-bold text-[#0A192F]">
						Reset Password
					</CardTitle>
					<CardDescription>
						{isSubmitted
							? "Check your inbox for the recovery link."
							: "Enter your email address and we will send you a link to reset your password."}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{!isSubmitted ? (
						<form
							onSubmit={handleSubmit}
							className="space-y-5"
						>
							<div className="space-y-2">
								<Label
									htmlFor="email"
									className="font-medium"
								>
									Email Address
								</Label>
								<Input
									id="email"
									type="email"
									placeholder="your.email@example.com"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									className="focus-visible:ring-[#0A192F]"
								/>
							</div>
							<Button
								type="submit"
								disabled={isLoading}
								className="w-full bg-[#0A192F] hover:bg-[#112240] text-white h-11 text-base font-semibold"
							>
								{isLoading ? "Sending..." : "Send Recovery Link"}
							</Button>
						</form>
					) : (
						<div className="text-center p-4 bg-green-50 text-green-700 rounded-lg font-medium border border-green-100">
							If an account exists for {email}, an email has been sent with
							further instructions.
						</div>
					)}
				</CardContent>

				<CardFooter className="justify-center border-t border-gray-100 pt-6">
					<p className="text-sm text-gray-600">
						Remembered your password?{" "}
						<Link
							href="/login"
							className="text-blue-600 font-semibold hover:text-[#0A192F] hover:underline transition-colors"
						>
							Log in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
