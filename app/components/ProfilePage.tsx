"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

const ACADEMIC_LEVELS = ["100", "200", "300", "400", "500", "600"];

export default function ProfilePage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);
	const [isSaving, setIsSaving] = useState(false);
	const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);

	// 👇 Generates a massive 25-year range (e.g., 2011 to 2036)
	const currentYear = new Date().getFullYear();
	const GRADUATION_YEARS = Array.from({ length: 25 }, (_, i) =>
		String(currentYear - 15 + i),
	);

	const [formData, setFormData] = useState({
		full_name: "",
		level: "",
		graduation_year: "",
	});

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
					{
						method: "GET",
						headers: { "Content-Type": "application/json" },
						credentials: "include",
					},
				);

				if (!response.ok) throw new Error("Failed to load profile");

				const data = await response.json();

				if (!data.level || !data.graduation_year) {
					setIsProfileIncomplete(true);
				}

				setFormData({
					full_name: data.full_name || "",
					level: data.level ? String(data.level) : "",
					graduation_year: data.graduation_year
						? String(data.graduation_year)
						: "",
				});
			} catch (error: unknown) {
				if (error instanceof Error) {
					toast.error(error.message);
				} else {
					toast.error("Could not load your profile data.");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchProfile();
	}, []);

	const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({ ...formData, [e.target.id]: e.target.value });
	};

	const handleSelectChange = (field: string, value: string) => {
		setFormData({ ...formData, [field]: value });
	};

	const handleUpdate = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSaving(true);

		const payload = {
			full_name: formData.full_name,
			level: formData.level ? parseInt(formData.level, 10) : undefined,
			graduation_year: formData.graduation_year
				? parseInt(formData.graduation_year, 10)
				: undefined,
		};

		const targetEndpoint = isProfileIncomplete
			? "/users/complete-profile"
			: "/users/me";

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}${targetEndpoint}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify(payload),
				},
			);

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Failed to save profile.");
			}

			if (isProfileIncomplete) {
				setIsProfileIncomplete(false);
				toast.success("Profile completed successfully!");
			} else {
				toast.success("Profile updated successfully!");
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
		} finally {
			setIsSaving(false);
		}
	};

	const handleDelete = async () => {
		const confirmDelete = window.confirm(
			"Are you absolutely sure you want to deactivate your account? This action cannot be undone.",
		);

		if (!confirmDelete) return;

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				},
			);

			if (!response.ok) throw new Error("Failed to deactivate account.");

			toast.success("Account deactivated. Logging you out...");
			router.push("/login");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred.");
			}
		}
	};

	if (isLoading) {
		return (
			<div className="animate-pulse text-slate-500">
				Loading profile data...
			</div>
		);
	}

	return (
		<div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
			<Card className="shadow-sm border-slate-200">
				<CardHeader>
					<CardTitle className="text-2xl text-[#002B5B]">
						{isProfileIncomplete
							? "Complete Your Profile"
							: "Academic Information"}
					</CardTitle>
					<CardDescription>
						{isProfileIncomplete
							? "Please provide your academic details to fully activate your account."
							: "Update your academic details and basic profile information here."}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleUpdate}
						className="space-y-6"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-2 md:col-span-2">
								<Label htmlFor="full_name">Full Name</Label>
								<Input
									id="full_name"
									value={formData.full_name}
									onChange={handleTextChange}
									placeholder="e.g. Jane Doe"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="level">Academic Level</Label>
								<Select
									value={formData.level}
									onValueChange={(val) => handleSelectChange("level", val)}
								>
									<SelectTrigger id="level">
										<SelectValue placeholder="Select your level" />
									</SelectTrigger>
									<SelectContent>
										{ACADEMIC_LEVELS.map((lvl) => (
											<SelectItem
												key={lvl}
												value={lvl}
											>
												{lvl}L
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="space-y-2">
								<Label htmlFor="graduation_year">Graduation Year</Label>
								<Select
									value={formData.graduation_year}
									onValueChange={(val) =>
										handleSelectChange("graduation_year", val)
									}
								>
									<SelectTrigger id="graduation_year">
										<SelectValue placeholder="Select year" />
									</SelectTrigger>
									<SelectContent>
										{/* 👇 Rendered purely as the year string now */}
										{GRADUATION_YEARS.map((year) => (
											<SelectItem
												key={year}
												value={year}
											>
												{year}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
						<Button
							type="submit"
							disabled={isSaving}
							className="bg-[#002B5B] hover:bg-[#001f42] text-white w-full sm:w-auto"
						>
							{isSaving
								? "Saving..."
								: isProfileIncomplete
									? "Complete Profile"
									: "Save Changes"}
						</Button>
					</form>
				</CardContent>
			</Card>

			{!isProfileIncomplete && (
				<Card className="border-red-200 shadow-sm">
					<CardHeader>
						<CardTitle className="text-red-600">Danger Zone</CardTitle>
						<CardDescription>
							Permanently deactivate your portal access. This will flag your
							account as inactive.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Button
							variant="destructive"
							onClick={handleDelete}
							className="bg-red-500 hover:bg-red-600"
						>
							Deactivate Account
						</Button>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
