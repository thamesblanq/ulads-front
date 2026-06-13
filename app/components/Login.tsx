"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Eye, EyeOff } from "lucide-react";
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

// 1. Validation Schema
const loginSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// 2. Validate with Zod before fetching
		const result = loginSchema.safeParse({ email, password });
		if (!result.success) {
			toast.error(result.error.issues[0].message);
			return;
		}

		setIsLoading(true);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
					credentials: "include", // Essential for HttpOnly cookies,
				},
			);

			if (!response.ok) {
				throw new Error("Invalid email or password.");
			}

			toast.success("Welcome back!");
			router.push("/dashboard");
			router.refresh(); // Refresh the layout to reflect "logged in" state
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Login failed.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
			<div className="absolute top-8 left-4 sm:left-8">
				<Link
					href="/"
					className="flex items-center text-sm font-medium text-gray-500 hover:text-[#0A192F]"
				>
					<ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
				</Link>
			</div>

			<Card className="w-full max-w-md shadow-xl border-gray-100">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl font-bold text-[#0A192F]">
						Welcome Back
					</CardTitle>
					<CardDescription>
						Sign in to access your ULADS dashboard
					</CardDescription>
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
								placeholder="name@email.com"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								disabled={isLoading}
								required
							/>
						</div>

						<div className="space-y-2 relative">
							<div className="flex items-center justify-between">
								<Label htmlFor="password">Password</Label>
								<Link
									href="/forgot-password"
									className="text-xs text-blue-600 hover:underline"
								>
									Forgot?
								</Link>
							</div>
							<Input
								id="password"
								type={showPassword ? "text" : "password"}
								placeholder="••••••••"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								disabled={isLoading}
								required
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
							>
								{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
							</button>
						</div>

						<Button
							type="submit"
							className="w-full bg-[#0A192F]"
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="animate-spin mr-2" />
							) : (
								"Sign In"
							)}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
