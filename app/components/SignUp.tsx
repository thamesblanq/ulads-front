"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod"; // 👈 Import Zod
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

// 1. Define the validation schema
const signUpSchema = z.object({
	email: z.string().email({ message: "Please enter a valid email address." }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters." }),
});

export default function SignUpPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// 2. Validate input using Zod
		const result = signUpSchema.safeParse({ email, password });

		if (!result.success) {
			// Display Zod validation errors via toast
			result.error.issues.forEach((issue) =>
				toast.error(`${String(issue.path[0])}: ${issue.message}`),
			);
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to create account.");
			}

			toast.success("Account created successfully!");
			router.push("/login");
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "An unexpected error occurred.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
			<div className="absolute top-8 left-4 sm:left-8">
				<Link
					href="/"
					className="flex items-center text-sm font-medium text-gray-500 hover:text-[#0A192F] transition-colors"
				>
					<ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
				</Link>
			</div>

			<Card className="w-full max-w-md shadow-xl border-gray-100">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold text-[#0A192F]">
						Create Student Account
					</CardTitle>
					<CardDescription>Join the ULADS community today.</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className="space-y-5"
					>
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
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
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="••••••••"
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
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							) : (
								"Sign Up"
							)}
						</Button>
					</form>
				</CardContent>
				<CardFooter className="justify-center border-t border-gray-100 pt-6">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-blue-600 font-semibold hover:underline"
						>
							Log in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
}
