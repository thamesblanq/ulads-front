"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
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

export default function SignUpPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		try {
			// Make the actual request to your NestJS API
			// Note: Update '/auth/register' if your NestJS route is named differently
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to create account.");
			}

			// 🎉 Success! Fire the green toast and send them to the login page
			toast.success(
				"Account created successfully! Please log in with your details.",
			);
			router.push("/login");
		} catch (error) {
			console.error("Signup Error:", error);

			// 🚨 Error! Fire the red toast
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred during signup.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 relative">
			{/* Back to Home Link */}
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
						Create Student Account
					</CardTitle>
					<CardDescription>
						Enter your email and password to access the portal
					</CardDescription>
				</CardHeader>

				<CardContent>
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

						<div className="space-y-2">
							<Label
								htmlFor="password"
								className="font-medium"
							>
								Password
							</Label>
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
							{isLoading ? "Creating account..." : "Sign Up"}
						</Button>
					</form>
				</CardContent>

				<CardFooter className="justify-center border-t border-gray-100 pt-6">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
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
