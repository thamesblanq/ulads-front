"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
	Search,
	Trash2,
	ShieldAlert,
	RefreshCw,
	Ban,
	CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// 1. Strictly define our Types
interface UserProfile {
	id: string;
	email: string;
	name: string;
	matric?: string;
	level?: string | number;
	graduation_year?: string | number;
	role: string;
	isSuspended: boolean;
	avatar: string;
}

interface SystemLog {
	id: string | number;
	date: string;
	email: string;
	role: string;
	route: string;
	action: string;
	status: number;
}

export default function AdminDashboard() {
	// Search & UI States
	const [searchQuery, setSearchQuery] = useState("");
	const [isSearching, setIsSearching] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isLoadingLogs, setIsLoadingLogs] = useState(true);

	// Data States
	const [foundUser, setFoundUser] = useState<UserProfile | null>(null);
	const [logs, setLogs] = useState<SystemLog[]>([]);

	// Pagination States
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalLogsCount, setTotalLogsCount] = useState(0);

	// ==========================================
	// 1. REUSABLE FETCH LOGIC (Linter Safe)
	// ==========================================
	const fetchLogsData = useCallback(async (page: number) => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/logs?page=${page}&limit=10`,
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			},
		);

		if (!response.ok) throw new Error("Failed to fetch logs");
		return await response.json();
	}, []);

	// ==========================================
	// 2. INITIAL & PAGINATION FETCH
	// ==========================================
	useEffect(() => {
		let isMounted = true;

		const loadLogs = async () => {
			setIsLoadingLogs(true);
			try {
				const responseData = await fetchLogsData(currentPage);

				if (isMounted) {
					setLogs(responseData.data);
					setTotalPages(responseData.meta.lastPage);
					setTotalLogsCount(responseData.meta.total);
				}
			} catch (error: unknown) {
				if (isMounted) {
					toast.error("Could not load system logs.");
				}
			} finally {
				if (isMounted) {
					setIsLoadingLogs(false);
				}
			}
		};

		loadLogs();

		return () => {
			isMounted = false;
		};
	}, [currentPage, fetchLogsData]); // Automatically re-runs when currentPage changes

	// ==========================================
	// 3. MANUAL REFRESH
	// ==========================================
	const handleRefreshLogs = async () => {
		setIsRefreshing(true);
		try {
			const responseData = await fetchLogsData(currentPage);
			setLogs(responseData.data);
			setTotalPages(responseData.meta.lastPage);
			setTotalLogsCount(responseData.meta.total);
			toast.success("Logs updated");
		} catch (error: unknown) {
			toast.error("Could not refresh system logs.");
		} finally {
			setIsRefreshing(false);
		}
	};

	// ==========================================
	// 4. SEARCH USER
	// ==========================================
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

			if (!response.ok) throw new Error("Failed to search users");

			const users = await response.json();

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
				toast.success("User found!");
			} else {
				toast.error("No user found with that email.");
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Search failed. Ensure you have Superadmin rights.");
			}
		} finally {
			setIsSearching(false);
		}
	};

	// ==========================================
	// 5. UPDATE ROLE
	// ==========================================
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

			if (!response.ok) throw new Error("Failed to update role");

			setFoundUser({ ...foundUser, role: newRole.toLowerCase() });
			toast.success(`Role updated to ${newRole}`);
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to update role.");
			}
		}
	};

	// ==========================================
	// 6. SHADOWBAN / SUSPEND
	// ==========================================
	const handleToggleSuspend = async () => {
		if (!foundUser) return;
		const isSuspending = !foundUser.isSuspended;
		const actionText = isSuspending ? "shadowban" : "restore";

		if (!window.confirm(`Are you sure you want to ${actionText} this user?`))
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

			if (!response.ok) throw new Error("Failed to update suspension status");

			setFoundUser({ ...foundUser, isSuspended: isSuspending });

			if (isSuspending) {
				toast.error("User account has been suspended (Shadowbanned).");
			} else {
				toast.success("User account restored.");
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to update account status.");
			}
		}
	};

	// ==========================================
	// 7. HARD DELETE
	// ==========================================
	const handleHardDelete = async () => {
		if (!foundUser) return;
		if (
			!window.confirm(
				"WARNING: This will permanently wipe the user from the database. This cannot be undone. Proceed?",
			)
		)
			return;

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/users/${foundUser.id}/hard-delete`,
				{
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				},
			);

			if (!response.ok) throw new Error("Failed to delete user");

			toast.success("User permanently deleted.");
			setFoundUser(null);
			setSearchQuery("");
		} catch (error: unknown) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("Failed to delete user.");
			}
		}
	};

	return (
		<div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
			{/* SECTION 1: User Search & Management */}
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
					<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 group-focus-within:text-[#002B5B] transition-colors" />
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder="Search members by exact email..."
						className="w-full pl-12 pr-24 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#002B5B]/10 focus:border-[#002B5B] outline-none transition-all text-gray-900"
					/>
					<button
						type="submit"
						disabled={isSearching || !searchQuery.trim()}
						className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#002B5B] text-white text-sm font-semibold rounded-lg hover:bg-[#001f42] transition-colors disabled:opacity-70"
					>
						{isSearching ? "Searching..." : "Search"}
					</button>
				</form>

				{/* Found User Profile Card */}
				{foundUser && (
					<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
						<div className="p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center gap-6">
							{/* Avatar & Shadowban Indicator */}
							<div className="relative">
								<div
									className={cn(
										"size-20 rounded-2xl flex items-center justify-center font-bold text-2xl border shrink-0 transition-colors",
										foundUser.isSuspended
											? "bg-red-50 text-red-700 border-red-200"
											: "bg-blue-50 text-[#002B5B] border-blue-100",
									)}
								>
									{foundUser.avatar}
								</div>
								{foundUser.isSuspended && (
									<div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm">
										<Ban className="size-4" />
									</div>
								)}
							</div>

							{/* User Details */}
							<div className="flex-1 space-y-1 w-full">
								<div className="flex items-center gap-3">
									<h3
										className={cn(
											"text-xl font-bold",
											foundUser.isSuspended
												? "text-gray-400 line-through"
												: "text-gray-900",
										)}
									>
										{foundUser.name}
									</h3>
									<span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded tracking-wider">
										{foundUser.role}
									</span>
									{foundUser.isSuspended && (
										<span className="px-2 py-1 bg-red-100 text-red-700 text-[10px] font-bold uppercase rounded tracking-wider animate-pulse">
											Suspended
										</span>
									)}
								</div>
								<p className="text-gray-500">{foundUser.email}</p>
								<div className="flex flex-wrap gap-4 mt-2">
									<div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
										<span className="font-semibold text-gray-400">Level:</span>{" "}
										{foundUser.level ? `${foundUser.level}L` : "N/A"}
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
										<span className="font-semibold text-gray-400">Class:</span>{" "}
										{foundUser.graduation_year || "N/A"}
									</div>
								</div>
							</div>

							{/* Admin Actions */}
							<div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0 border-t lg:border-t-0 lg:border-l border-gray-100 pt-4 lg:pt-0 lg:pl-6">
								{/* Role Changer Dropdown */}
								<select
									value={foundUser.role}
									onChange={(e) => handleRoleChange(e.target.value)}
									className="appearance-none w-full sm:w-40 bg-white border border-gray-200 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#002B5B]"
								>
									<option value="user">Role: User</option>
									<option value="admin">Role: Admin</option>
									<option value="superadmin">Role: Superadmin</option>
								</select>

								{/* Shadowban Button */}
								<button
									onClick={handleToggleSuspend}
									className={cn(
										"flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-colors border",
										foundUser.isSuspended
											? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
											: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
									)}
								>
									{foundUser.isSuspended ? (
										<CheckCircle2 className="size-4" />
									) : (
										<Ban className="size-4" />
									)}
									{foundUser.isSuspended ? "Restore User" : "Suspend User"}
								</button>

								{/* Hard Delete Button */}
								<button
									onClick={handleHardDelete}
									className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors border border-red-100"
								>
									<Trash2 className="size-4" />
								</button>
							</div>
						</div>
					</div>
				)}
			</section>

			{/* SECTION 2: System Activity Logs */}
			<section className="space-y-4 pt-8 border-t border-gray-200">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<h2 className="text-xl font-bold text-[#002B5B]">
							System Audit Logs
						</h2>
						<button
							onClick={handleRefreshLogs}
							title="Refresh Latest Logs"
							className={cn(
								"p-1.5 text-gray-400 hover:text-[#002B5B] hover:bg-white rounded-md border border-transparent hover:border-gray-200 transition-all shadow-sm",
								isRefreshing && "animate-spin text-[#002B5B]",
							)}
						>
							<RefreshCw className="size-4" />
						</button>
					</div>
				</div>

				<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
					<div className="overflow-x-auto">
						<table className="w-full text-left">
							<thead>
								<tr className="bg-gray-50/80 border-b border-gray-200">
									<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
										Date / Time
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
										User Email
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
										Role
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
										Route Visited
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
										Action
									</th>
									<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-center">
										Status Code
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100">
								{isLoadingLogs ? (
									<tr>
										<td
											colSpan={6}
											className="text-center py-8 text-gray-500 animate-pulse font-medium"
										>
											Fetching live audit logs from database...
										</td>
									</tr>
								) : logs.length === 0 ? (
									<tr>
										<td
											colSpan={6}
											className="text-center py-8 text-gray-500 font-medium"
										>
											No recent activity found.
										</td>
									</tr>
								) : (
									logs.map((log) => (
										<tr
											key={log.id}
											className="hover:bg-gray-50/50 transition-colors"
										>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium font-mono">
												{log.date}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
												{log.email}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 capitalize">
												{log.role}
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-[#002B5B] font-medium italic">
												{log.route}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={cn(
														"inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider",
														log.action === "GET"
															? "bg-blue-100 text-blue-700"
															: log.action === "POST"
																? "bg-green-100 text-green-700"
																: log.action === "PATCH" || log.action === "PUT"
																	? "bg-amber-100 text-amber-700"
																	: log.action === "DELETE"
																		? "bg-red-100 text-red-700"
																		: "bg-gray-100 text-gray-700",
													)}
												>
													{log.action}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-center">
												<span
													className={cn(
														"text-xs font-mono font-bold px-2 py-1 rounded",
														log.status < 300
															? "text-green-600 bg-green-50"
															: log.status < 400
																? "text-blue-600 bg-blue-50"
																: "text-red-500 bg-red-50",
													)}
												>
													{log.status}
												</span>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination Footer */}
					<div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between mt-auto">
						<p className="text-xs text-gray-500 font-medium">
							Showing page{" "}
							<span className="font-bold text-gray-900">{currentPage}</span> of{" "}
							<span className="font-bold text-gray-900">{totalPages}</span> (
							{totalLogsCount} total logs)
						</p>
						<div className="flex gap-2">
							<button
								onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
								disabled={currentPage === 1 || isLoadingLogs}
								className="px-3 py-1.5 text-xs font-bold text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
							>
								Previous
							</button>
							<button
								onClick={() =>
									setCurrentPage((prev) => Math.min(prev + 1, totalPages))
								}
								disabled={currentPage >= totalPages || isLoadingLogs}
								className="px-3 py-1.5 text-xs font-bold text-[#002B5B] bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
							>
								Next
							</button>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
