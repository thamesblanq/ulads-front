"use client";

import React, { useState } from "react";
import { Vote, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminElection } from "@/types";

export function ElectionManagement({
	initialElections,
}: {
	initialElections: AdminElection[];
}) {
	const [elections, setElections] = useState<AdminElection[]>(initialElections);
	const [isLoading, setIsLoading] = useState(false);

	const fetchAllElections = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(`/api/elections/all`, {
				credentials: "include",
			});
			if (!response.ok) throw new Error("Failed to fetch elections");
			setElections(await response.json());
			toast.success("Elections refreshed");
		} catch (error) {
			console.error(error);
			toast.error("Could not load elections list.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggleStatus = async (
		electionId: string,
		currentStatus: boolean,
	) => {
		const newStatus = !currentStatus;
		try {
			const response = await fetch(`/api/elections/${electionId}/status`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ is_active: newStatus }),
			});
			if (!response.ok) throw new Error("Failed to update status");

			setElections((prev) =>
				prev.map((el) =>
					el.id === electionId ? { ...el, is_active: newStatus } : el,
				),
			);
			toast.success(`Election is now ${newStatus ? "Approved" : "Drafted"}`);
		} catch (error) {
			console.error(error);
			toast.error("Could not update election status.");
		}
	};

	return (
		<section className="space-y-4">
			<div className="flex items-center justify-between">
				<div>
					<h2 className="text-xl font-bold text-[#002B5B] flex items-center gap-2">
						<Vote className="size-5" /> Election Status Management
					</h2>
					<p className="text-xs text-gray-500 mt-1">
						Approve elections to make them visible to students during their
						scheduled dates.
					</p>
				</div>
				<button
					onClick={fetchAllElections}
					className="p-1.5 text-gray-400 hover:text-[#002B5B] hover:bg-white rounded-md border border-transparent hover:border-gray-200 transition-all shadow-sm"
				>
					<RefreshCw className={cn("size-4", isLoading && "animate-spin")} />
				</button>
			</div>

			<div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
				<table className="w-full text-left">
					<thead>
						<tr className="bg-gray-50/80 border-b border-gray-200">
							<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
								Title
							</th>
							<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
								Start Time
							</th>
							<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
								End Time
							</th>
							<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">
								Admin Status
							</th>
							<th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-center">
								Action
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-gray-100">
						{elections.length === 0 ? (
							<tr>
								<td
									colSpan={5}
									className="text-center py-8 text-gray-500"
								>
									No elections found.
								</td>
							</tr>
						) : (
							elections.map((election) => (
								<tr
									key={election.id}
									className="hover:bg-gray-50/50 transition-colors"
								>
									<td className="px-6 py-4 font-bold text-gray-900 text-sm">
										{election.title}
									</td>
									<td className="px-6 py-4 text-gray-600 text-sm font-mono">
										{new Date(election.start_time).toLocaleString()}
									</td>
									<td className="px-6 py-4 text-gray-600 text-sm font-mono">
										{new Date(election.end_time).toLocaleString()}
									</td>
									<td className="px-6 py-4 text-center">
										<span
											className={cn(
												"px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
												election.is_active
													? "bg-green-100 text-green-700"
													: "bg-gray-100 text-gray-600",
											)}
										>
											{election.is_active ? "Approved" : "Draft"}
										</span>
									</td>
									<td className="px-6 py-4 text-center">
										<button
											onClick={() =>
												handleToggleStatus(election.id, election.is_active)
											}
											className={cn(
												"px-4 py-1.5 rounded-lg text-xs font-bold transition-colors border",
												election.is_active
													? "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100"
													: "bg-[#002B5B] text-white border-[#002B5B] hover:bg-[#001f42]",
											)}
										>
											{election.is_active ? "Revoke" : "Approve"}
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}
