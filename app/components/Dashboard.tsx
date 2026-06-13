"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquare, CreditCard, UserCheck, Clock } from "lucide-react";
import { UserProfile, ActiveElection } from "@/types";

export default function DashboardPage() {
	const router = useRouter();

	// Explicitly typed states
	const [userData, setUserData] = useState<UserProfile | null>(null);
	const [activeElection, setActiveElection] = useState<ActiveElection | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const loadDashboardData = async () => {
			setIsLoading(true);
			try {
				const [userRes, electionRes] = await Promise.all([
					fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
						credentials: "include",
					}),
					fetch(`${process.env.NEXT_PUBLIC_API_URL}/elections/active`, {
						credentials: "include",
					}),
				]);

				if (userRes.status === 401) {
					router.push("/login");
					return;
				}

				if (userRes.ok) {
					const data: UserProfile = await userRes.json();
					setUserData(data);
				}

				if (electionRes.ok) {
					const data: ActiveElection | null = await electionRes.json();
					setActiveElection(data);
				}
			} catch (err) {
				console.error("Failed to load dashboard data", err);
			} finally {
				setIsLoading(false);
			}
		};

		loadDashboardData();
	}, [router]);

	const getElectionSubtitle = (): string => {
		if (!activeElection) return "No active elections";
		const days = Math.ceil(
			(new Date(activeElection.endTime).getTime() - new Date().getTime()) /
				(1000 * 60 * 60 * 24),
		);
		return days > 0 ? `Ends in ${days} day(s)` : "Ending today";
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002B5B]"></div>
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in duration-500">
			{/* Welcome Banner */}
			<section className="bg-[#002B5B] p-8 lg:p-12 text-white rounded-2xl shadow-lg">
				<h1 className="text-3xl lg:text-4xl font-bold">
					Welcome back, {userData?.full_name?.split(" ")[0] || "Student"}
				</h1>
				<p className="text-white/70 mt-2">
					Manage your ULADS profile and stay updated.
				</p>
			</section>

			{/* Metric Cards Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm">
					<div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
						<MessageSquare size={24} />
					</div>
					<p className="text-sm text-slate-500">Unread Messages</p>
					<p className="text-2xl font-bold">0</p>
				</div>

				<div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm">
					<div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4">
						<CreditCard size={24} />
					</div>
					<p className="text-sm text-slate-500">Dues Status</p>
					<p className="text-2xl font-bold">Pending</p>
				</div>

				<div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm">
					<div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
						<UserCheck size={24} />
					</div>
					<p className="text-sm text-slate-500">
						{activeElection ? activeElection.title : "Upcoming Elections"}
					</p>
					<p className="text-xl font-bold mt-1">
						{activeElection
							? `${activeElection.candidates.length} Candidates`
							: "None"}
					</p>
					{activeElection && (
						<p className="text-xs text-purple-500 mt-2 flex items-center gap-1">
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
