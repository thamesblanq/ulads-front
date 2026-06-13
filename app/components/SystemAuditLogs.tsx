"use client";
import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface SystemLog {
	id: string | number;
	date: string;
	email: string;
	role: string;
	route: string;
	action: string;
	status: number;
}

export function SystemAuditLogs() {
	const [logs, setLogs] = useState<SystemLog[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	const fetchLogs = useCallback(async (page: number) => {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_API_URL}/logs?page=${page}&limit=10`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					// Authorization: `Bearer ${localStorage.getItem('token')}` // Uncomment if using localStorage JWT
				},
				credentials: "include", // This is crucial for cookie-based sessions!
			},
		);

		if (!response.ok) {
			console.error(
				"Backend rejected the logs fetch. Status:",
				response.status,
			);
			throw new Error("Could not parse audit data stream.");
		}

		return await response.json();
	}, []);

	const loadLogState = useCallback(
		async (page: number, showSuccessToast = false) => {
			try {
				const res = await fetchLogs(page);
				setLogs(res.data);
				setTotalPages(res.meta.lastPage);
				setTotalCount(res.meta.total);
				if (showSuccessToast) {
					toast.success("System activity matrix synchronized.");
				}
			} catch (err) {
				console.error("Error loading audit logs:", err);
				toast.error("Failed to map incoming audit vectors.");
			} finally {
				setIsLoading(false);
				setIsRefreshing(false);
			}
		},
		[fetchLogs],
	);

	useEffect(() => {
		const loadLogs = async () => {
			await loadLogState(currentPage);
		};
		loadLogs();
	}, [currentPage, loadLogState]);

	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h3 className="text-lg font-bold text-[#002B5B]">
					System Operation Logs
				</h3>
				<button
					onClick={() => {
						setIsRefreshing(true);
						loadLogState(currentPage, true);
					}}
					disabled={isRefreshing}
					className="p-2 border border-gray-200 hover:border-[#002B5B] rounded-xl bg-white text-gray-400 hover:text-[#002B5B] transition-all"
				>
					<RefreshCw
						className={cn(
							"size-4",
							isRefreshing && "animate-spin text-[#002B5B]",
						)}
					/>
				</button>
			</div>

			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
				<div className="overflow-x-auto">
					<table className="w-full text-left text-xs">
						<thead>
							<tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
								<th className="px-6 py-3.5">Timestamp</th>
								<th className="px-6 py-3.5">Operator</th>
								<th className="px-6 py-3.5">Scope</th>
								<th className="px-6 py-3.5">Route Vector</th>
								<th className="px-6 py-3.5">Method</th>
								<th className="px-6 py-3.5 text-center">Status</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 font-medium">
							{isLoading ? (
								<tr>
									<td
										colSpan={6}
										className="text-center py-8 text-gray-400 animate-pulse font-medium"
									>
										Parsing database log rows...
									</td>
								</tr>
							) : logs.length === 0 ? (
								<tr>
									<td
										colSpan={6}
										className="text-center py-8 text-gray-400 font-medium"
									>
										Clear audit pipeline. Zero records found.
									</td>
								</tr>
							) : (
								logs.map((log) => (
									<tr
										key={log.id}
										className="hover:bg-gray-50/40 text-gray-600 transition-colors"
									>
										<td className="px-6 py-3.5 font-mono text-gray-400">
											{log.date}
										</td>
										<td className="px-6 py-3.5 font-semibold text-gray-900">
											{log.email}
										</td>
										<td className="px-6 py-3.5 capitalize">{log.role}</td>
										<td className="px-6 py-3.5 text-[#002B5B] font-mono italic">
											{log.route}
										</td>
										<td className="px-6 py-3.5">
											<span
												className={cn(
													"px-2 py-0.5 rounded text-[10px] font-bold tracking-wide",
													log.action === "GET"
														? "bg-blue-50 text-blue-600"
														: log.action === "POST"
															? "bg-green-50 text-green-600"
															: "bg-amber-50 text-amber-600",
												)}
											>
												{log.action}
											</span>
										</td>
										<td className="px-6 py-3.5 text-center">
											<span
												className={cn(
													"font-mono font-bold px-1.5 py-0.5 rounded text-[11px]",
													log.status < 300
														? "text-green-600 bg-green-50"
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

				<div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 font-medium">
					<p>
						Page <span className="font-bold text-gray-900">{currentPage}</span>{" "}
						of <span className="font-bold text-gray-900">{totalPages}</span> (
						{totalCount} entries)
					</p>
					<div className="flex gap-2">
						<button
							onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
							disabled={currentPage === 1 || isLoading}
							className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
						>
							Prev
						</button>
						<button
							onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
							disabled={currentPage >= totalPages || isLoading}
							className="px-3 py-1 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40"
						>
							Next
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
