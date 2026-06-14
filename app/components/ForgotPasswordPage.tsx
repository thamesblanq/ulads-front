"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
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

const emailSchema = z.string().email("Please enter a valid email address.");

export default function ForgotPasswordPage() {
	const [email, setEmail] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// 1. Client-side Zod validation
		const result = emailSchema.safeParse(email);
		if (!result.success) {
			toast.error(result.error.issues[0].message);
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`/api/auth/forgot-password`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});

			if (!response.ok) throw new Error("Failed to process request.");

			setIsSubmitted(true);
		} catch (error) {
			console.error("Error sending recovery link:", error);
			toast.error("Failed to send recovery link. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
			<div className="absolute top-8 left-4 sm:left-8">
				<Link
					href="/login"
					className="flex items-center text-sm font-medium text-gray-500 hover:text-[#0A192F]"
				>
					<ArrowLeft className="w-4 h-4 mr-2" /> Back to Login
				</Link>
			</div>

			<Card className="w-full max-w-md shadow-xl border-gray-100">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold text-[#0A192F]">
						{isSubmitted ? "Check your email" : "Reset Password"}
					</CardTitle>
					<CardDescription>
						{isSubmitted
							? "We've sent a secure recovery link to your inbox."
							: "Enter your email to receive a password reset link."}
					</CardDescription>
				</CardHeader>

				<CardContent>
					{!isSubmitted ? (
						<form
							onSubmit={handleSubmit}
							className="space-y-5"
						>
							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									placeholder="name@email.com"
									required
									disabled={isLoading}
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
									"Send Recovery Link"
								)}
							</Button>
						</form>
					) : (
						<div className="flex flex-col items-center py-4 text-center space-y-4">
							<div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
								<CheckCircle2 className="text-green-600 w-8 h-8" />
							</div>
							<p className="text-sm text-gray-600 px-4">
								If an account exists for{" "}
								<span className="font-bold">{email}</span>, you will receive
								instructions shortly.
							</p>
							<Button
								variant="outline"
								onClick={() => setIsSubmitted(false)}
							>
								Try another email
							</Button>
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
