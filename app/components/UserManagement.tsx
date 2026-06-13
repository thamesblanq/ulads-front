"use client";

import React, { useState } from "react";
import { Search, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { UserProfile } from "@/types";

export function UserManagement() {
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [foundUser, setFoundUser] = useState<UserProfile | null>(null);

	// Manual search through the /users endpoint
	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;

		setIsSearching(true);
		setFoundUser(null);

		try {
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
				method: "GET",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			});

			if (!response.ok) throw new Error("Failed to search database directory.");
			const users = await response.json();

			// Perform the filter in the frontend
			const matchedUser = users.find(
				(u: { email: string }) =>
					u.email.toLowerCase() === searchQuery.trim().toLowerCase(),
			);

			if (matchedUser) {
				setFoundUser({
					...matchedUser,
					name: matchedUser.full_name || "Name not set",
					avatar: matchedUser.email.charAt(0).toUpperCase(),
					isSuspended: matchedUser.isSuspended || false,
				});
				toast.success("User configuration matched!");
			} else {
				toast.error("No member user matched that exact email address.");
			}
		} catch (error: unknown) {
			toast.error(
				error instanceof Error
					? error.message
					: "Search security verification failed.",
			);
		} finally {
			setIsSearching(false);
		}
	};

	const handleRoleChange = async (newRole: string) => {
		if (!foundUser) return;
		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/users/${foundUser.id}/role`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ role: newRole }),
				},
			);

			if (!response.ok) throw new Error("Role update execution rejected.");
			setFoundUser({ ...foundUser, role: newRole.toLowerCase() });
			toast.success(`Access level shifted to ${newRole}`);
		} catch (error: unknown) {
			toast.error(
				error instanceof Error
					? error.message
					: "Failed to cycle configuration.",
			);
		}
	};

	const handleToggleSuspend = async () => {
		if (!foundUser) return;
		const isSuspending = !foundUser.isSuspended;

		if (!window.confirm(`Are you sure you want to alter the suspension state?`))
			return;

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/users/${foundUser.id}/suspend`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ is_suspended: isSuspending }),
				},
			);

			if (!response.ok) throw new Error("Suspension matrix sync failure.");
			setFoundUser({ ...foundUser, isSuspended: isSuspending });
			toast.info(
				isSuspending
					? "Account flagged as Suspended."
					: "Account authorization restored.",
			);
		} catch (error: unknown) {
			toast.error(
				error instanceof Error ? error.message : "Network restriction error.",
			);
		}
	};

	const handleHardDelete = async () => {
		if (!foundUser) return;
		if (!window.confirm("CRITICAL: Wipe this user row entirely?")) return;

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/users/${foundUser.id}/hard-delete`,
				{
					method: "DELETE",
					credentials: "include",
				},
			);

			if (!response.ok)
				throw new Error("Cascade delete constraints rejected command.");
			toast.success("Database record wiped out permanently.");
			setFoundUser(null);
			setSearchQuery("");
		} catch (error: unknown) {
			toast.error(
				error instanceof Error ? error.message : "Table structural error.",
			);
		}
	};

	return (
		<section className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-[#002B5B] mb-1 flex items-center gap-2">
					<ShieldAlert className="size-6" /> User Management
				</h2>
				<p className="text-gray-500">
					Search and manage member roles, or issue account suspensions.
				</p>
			</div>

			<form
				onSubmit={handleSearch}
				className="relative group max-w-2xl"
			>
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-[#002B5B]" />
				<input
					type="text"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					placeholder="Search members by exact email..."
					className="w-full pl-12 pr-24 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#002B5B]/10 focus:border-[#002B5B] outline-none transition-all"
				/>
				<button
					type="submit"
					disabled={isSearching || !searchQuery.trim()}
					className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#002B5B] text-white text-sm font-semibold rounded-lg hover:bg-[#001f42] disabled:opacity-70"
				>
					{isSearching ? "Searching..." : "Search"}
				</button>
			</form>

			{foundUser && (
				<div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
					<div className="flex items-center gap-4">
						<div
							className={cn(
								"size-14 rounded-xl flex items-center justify-center font-bold text-lg border",
								foundUser.isSuspended
									? "bg-red-50 text-red-700"
									: "bg-blue-50 text-[#002B5B]",
							)}
						>
							{foundUser.avatar}
						</div>
						<div>
							<h4
								className={cn(
									"font-bold",
									foundUser.isSuspended && "line-through text-gray-400",
								)}
							>
								{foundUser.full_name}
							</h4>
							<p className="text-xs text-gray-500">{foundUser.email}</p>
							<span className="text-[10px] font-bold uppercase bg-gray-100 px-1.5 py-0.5 rounded">
								{foundUser.role}
							</span>
						</div>
					</div>

					<div className="flex gap-2 w-full md:w-auto">
						<select
							value={foundUser.role}
							onChange={(e) => handleRoleChange(e.target.value)}
							className="text-xs border rounded-lg px-3 py-2"
						>
							<option value="user">User</option>
							<option value="admin">Admin</option>
							<option value="superadmin">Superadmin</option>
						</select>
						<button
							onClick={handleToggleSuspend}
							className="text-xs border px-3 py-2 rounded-lg"
						>
							{foundUser.isSuspended ? "Restore" : "Suspend"}
						</button>
						<button
							onClick={handleHardDelete}
							className="text-red-600 bg-red-50 px-3 py-2 rounded-lg"
						>
							<Trash2 className="size-4" />
						</button>
					</div>
				</div>
			)}
		</section>
	);
}
