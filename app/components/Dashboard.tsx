"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
	MessageSquare,
	CreditCard,
	UserCheck,
	Clock,
	ChevronRight,
} from "lucide-react";

const METRIC_CARDS = [
	{
		title: "Unread Messages",
		value: "4",
		icon: MessageSquare,
		color: "bg-blue-50 text-blue-600",
		borderColor: "border-blue-100",
	},
	{
		title: "Dues Status",
		value: "Paid",
		icon: CreditCard,
		color: "bg-green-50 text-green-600",
		borderColor: "border-green-100",
		badge: "Verified",
	},
	{
		title: "Upcoming Elections",
		value: "2",
		icon: UserCheck,
		color: "bg-purple-50 text-purple-600",
		borderColor: "border-purple-100",
		subtitle: "Election starts in 3 days",
	},
];

const ANNOUNCEMENTS = [
	{
		id: 1,
		title: "Annual Medical Symposium 2026",
		date: "June 15, 2026",
		category: "Event",
		description:
			"Registration is now open for the annual medical symposium. All students are required to attend.",
	},
	{
		id: 2,
		title: "New Clinical Rotation Schedule",
		date: "June 05, 2026",
		category: "Academic",
		description:
			"The updated rotation schedule for Batch B has been released. Please check your assigned hospitals.",
	},
];

interface UserProfile {
	id?: string;
	email?: string;
	role?: string;
	[key: string]: unknown;
}

export default function DashboardPage() {
	const router = useRouter();
	const [userData, setUserData] = useState<UserProfile | null>(null);
	const [error, setError] = useState<string>("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			try {
				const response = await fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
					{
						method: "GET",
						headers: { "Content-Type": "application/json" },
						credentials: "include", // Secures the request with your HttpOnly cookie
					},
				);

				if (!response.ok) {
					if (response.status === 401 || response.status === 403) {
						router.push("/login");
						return;
					}
					throw new Error("Failed to fetch data");
				}

				const data = await response.json();
				setUserData(data);
			} catch (err) {
				if (err instanceof Error) {
					setError(err.message);
				} else {
					setError("An unexpected error occurred.");
				}
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserData();
	}, [router]);

	// Loading State
	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-full min-h-100">
				<div className="animate-pulse flex flex-col items-center gap-4">
					<div className="h-12 w-12 border-4 border-[#002B5B] border-t-transparent rounded-full animate-spin"></div>
					<p className="text-slate-500 font-medium">Securing connection...</p>
				</div>
			</div>
		);
	}

	// Error State
	if (error) {
		return (
			<div className="p-4 bg-red-50 text-red-600 rounded-lg border border-red-200">
				<p className="font-semibold">Authentication Error</p>
				<p className="text-sm">{error}</p>
			</div>
		);
	}

	return (
		<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
			{/* Welcome Banner */}
			<section className="relative overflow-hidden rounded-2xl bg-[#002B5B] p-8 lg:p-12 text-white shadow-lg">
				<div className="relative z-10 space-y-2">
					<p className="text-white/70 text-sm font-medium uppercase tracking-wider">
						Student Portal
					</p>
					<h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
						Welcome back, {userData?.email?.split("@")[0] || "Student"}
					</h1>
					<p className="text-white/60 max-w-lg text-sm lg:text-base leading-relaxed">
						Stay updated with your latest academic progress, announcements, and
						upcoming ULADS elections.
					</p>
				</div>

				{/* Decorative elements */}
				<div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
				<div className="absolute bottom-0 right-0 -mb-24 -mr-24 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
			</section>

			{/* Metric Cards Row */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{METRIC_CARDS.map((card) => (
					<div
						key={card.title}
						className={`bg-white p-6 rounded-xl border ${card.borderColor} shadow-sm transition-all hover:shadow-md`}
					>
						<div className="flex items-start justify-between">
							<div className="space-y-4">
								<div
									className={`w-12 h-12 rounded-lg ${card.color} flex items-center justify-center`}
								>
									<card.icon size={24} />
								</div>
								<div>
									<p className="text-sm font-medium text-slate-500">
										{card.title}
									</p>
									<p className="text-2xl font-bold text-slate-900 mt-1">
										{card.value}
									</p>
								</div>
							</div>
							{card.badge && (
								<span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-green-100 text-green-700">
									{card.badge}
								</span>
							)}
						</div>
						{card.subtitle && (
							<p className="mt-4 text-xs text-slate-400 flex items-center gap-1">
								<Clock size={12} />
								{card.subtitle}
							</p>
						)}
					</div>
				))}
			</div>

			{/* Recent Announcements */}
			<section className="space-y-4">
				<div className="flex items-center justify-between">
					<h3 className="text-lg font-bold text-slate-900">
						Recent Announcements
					</h3>
					<button className="text-sm font-medium text-[#002B5B] hover:underline flex items-center gap-1">
						View all <ChevronRight size={16} />
					</button>
				</div>

				<div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
					{ANNOUNCEMENTS.map((announcement) => (
						<div
							key={announcement.id}
							className="p-6 hover:bg-slate-50 transition-colors group cursor-pointer"
						>
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="space-y-1">
									<div className="flex items-center gap-2">
										<span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase">
											{announcement.category}
										</span>
										<span className="text-xs text-slate-400">
											{announcement.date}
										</span>
									</div>
									<h4 className="text-base font-semibold text-slate-800 group-hover:text-[#002B5B] transition-colors">
										{announcement.title}
									</h4>
									<p className="text-sm text-slate-500 line-clamp-2 max-w-3xl">
										{announcement.description}
									</p>
								</div>
								<div className="hidden sm:block">
									<ChevronRight
										size={20}
										className="text-slate-300 group-hover:text-[#002B5B] transition-colors"
									/>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
