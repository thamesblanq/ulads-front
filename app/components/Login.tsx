"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react"; // 👈 Import an icon for the back button
import { toast } from "sonner"; // 👈 Import the toast function
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

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setErrorMessage(""); // Clear any previous errors

		const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
		const url = `${baseUrl}/auth/login`;

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
				credentials: "include",
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Invalid email or password");
			}

			// 🎉 The Green Login Toast!
			toast.success("Welcome, you're logged in!");
			router.push("/dashboard");
		} catch (error) {
			console.error("Login Error:", error);
			// 🚨 The Red Error Toast!
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred during login.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 relative">
			{/* 👇 Back to Home Link placed at the top left of the screen */}
			<div className="absolute top-8 left-4 sm:left-8">
				<Link
					href="/"
					className="flex items-center text-sm font-medium text-gray-500 hover:text-[#0A192F] transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" />
					Back to Home
				</Link>
			</div>

			<Card className="w-full max-w-md shadow-xl border-gray-100">
				<CardHeader className="space-y-2 text-center">
					<CardTitle className="text-2xl font-bold text-[#0A192F]">
						Welcome Back
					</CardTitle>
					<CardDescription>
						Enter your credentials to access the ULADS portal
					</CardDescription>
				</CardHeader>

				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-5"
					>
						{/* 👇 Error Message Display */}
						{errorMessage && (
							<div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
								{errorMessage}
							</div>
						)}

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

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label
									htmlFor="password"
									className="font-medium"
								>
									Password
								</Label>
								<Link
									href="/forgot-password"
									className="text-sm text-blue-600 hover:text-[#0A192F] hover:underline transition-colors"
								>
									Forgot password?
								</Link>
							</div>
							<Input
								id="password"
								type="password"
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
								className="focus-visible:ring-[#0A192F]"
							/>
						</div>

						<Button
							type="submit"
							disabled={isLoading}
							className="w-full bg-[#0A192F] hover:bg-[#112240] text-white transition-colors h-11 text-base font-semibold"
						>
							{isLoading ? "Signing in..." : "Sign In"}
						</Button>
					</form>
				</CardContent>

				<CardFooter className="justify-center border-t border-gray-100 pt-6">
					<p className="text-sm text-gray-600">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="text-blue-600 font-semibold hover:text-[#0A192F] hover:underline transition-colors"
						>
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
