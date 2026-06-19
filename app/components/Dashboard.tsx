"use client";

import { MessageSquare, CreditCard, UserCheck, Clock } from "lucide-react";
import useSWR from "swr";
import { ActiveElection, UserProfile } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

// 1. SWR Fetcher
const fetcher = (url: string) =>
	fetch(url, { credentials: "include" }).then((res) => {
		if (!res.ok) throw new Error("Failed to fetch");
		return res.json();
	});

export default function DashboardPage() {
	// 2. Fetch User (SWR automatically shares the cache with the Layout!)
	const { data: userData, isLoading: isUserLoading } = useSWR<UserProfile>(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
		fetcher,
	);

	// 3. Fetch Elections
	const { data: activeElection, isLoading: isElectionLoading } =
		useSWR<ActiveElection>(
			`${process.env.NEXT_PUBLIC_API_URL}/elections/active`,
			fetcher,
		);

	const getElectionSubtitle = (): string => {
		if (!activeElection) return "No active elections";
		const days = Math.ceil(
			(new Date(activeElection.endTime).getTime() - new Date().getTime()) /
				(1000 * 60 * 60 * 24),
		);
		return days > 0 ? `Ends in ${days} day(s)` : "Ending today";
	};

	const studentName = userData?.is_profile_complete
		? userData?.full_name?.split(".")[0] || "Student"
		: userData?.email?.split("@")[0] || "Student";

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Welcome Banner */}
			<section className="bg-[#002B5B] p-8 lg:p-12 text-white rounded-2xl shadow-lg">
				{isUserLoading ? (
					<Skeleton className="h-10 w-3/4 lg:w-1/2 bg-white/20 mb-2" />
				) : (
					<h1 className="text-3xl lg:text-4xl font-bold">
						Welcome back, {studentName}
					</h1>
				)}
				<p className="text-white/70 mt-2">
					Manage your ULADS profile and stay updated.
				</p>
			</section>

			{/* Metric Cards Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Messages Card */}
				<div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
					<div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
						<MessageSquare size={24} />
					</div>
					<p className="text-sm text-slate-500">Unread Messages</p>
					{isUserLoading ? (
						<Skeleton className="h-8 w-8 mt-1" />
					) : (
						<p className="text-2xl font-bold">0</p>
					)}
				</div>

				{/* Dues Card */}
				<div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
					<div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4">
						<CreditCard size={24} />
					</div>
					<p className="text-sm text-slate-500">Dues Status</p>
					{isUserLoading ? (
						<Skeleton className="h-8 w-20 mt-1" />
					) : (
						<p className="text-2xl font-bold">Pending</p>
					)}
				</div>

				{/* Elections Card */}
				<div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm flex flex-col justify-between">
					<div>
						<div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
							<UserCheck size={24} />
						</div>
						{isElectionLoading ? (
							<div className="space-y-2 mt-1">
								<Skeleton className="h-4 w-32" />
								<Skeleton className="h-6 w-24" />
							</div>
						) : (
							<>
								<p className="text-sm text-slate-500 line-clamp-1">
									{activeElection ? activeElection.title : "Upcoming Elections"}
								</p>
								<p className="text-xl font-bold mt-1">
									{activeElection
										? `${activeElection.candidates.length} Candidates`
										: "None"}
								</p>
							</>
						)}
					</div>

					{/* Bottom Status Row for Elections */}
					{!isElectionLoading && activeElection && (
						<p className="text-xs text-purple-500 mt-4 flex items-center gap-1">
							<Clock size={12} /> {getElectionSubtitle()}
						</p>
					)}
				</div>
			</div>

			{/* Announcements Placeholder Area */}
			<section className="mt-12">
				<h3 className="text-lg font-bold text-slate-900 mb-4">
					Recent Announcements
				</h3>
				<div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center text-slate-400">
					<p>Announcements will appear here soon.</p>
				</div>
			</section>
		</div>
	);
}
