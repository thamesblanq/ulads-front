"use client";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

// 1. The interface for your UI component
export interface Announcement {
	id: string | number;
	category: string;
	date: string;
	title: string;
	description: string;
}

// 2. The interface for the raw data from your NestJS Backend
interface BackendAnnouncement {
	id: string;
	category: string;
	created_at: string; // The database field
	title: string;
	content: string; // The database field
}

const HARDCODED_ANNOUNCEMENTS: Announcement[] = [
	{
		id: "h1",
		category: "Welcome",
		date: "May 1, 2026",
		title: "Welcome to ULADS Portal",
		description: "This is the official portal for all dental students.",
	},
];

export function AnnouncementPage() {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [expandedId, setExpandedId] = useState<string | number | null>(null);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/announcements`, {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				console.log("Backend response:", data); // 👈 THIS WILL TELL US THE PROBLEM

				// Check if data is actually an array, or if it's inside an object property
				const announcementArray = Array.isArray(data) ? data : data.data || [];

				if (Array.isArray(announcementArray)) {
					const dbData = announcementArray.map((item: BackendAnnouncement) => ({
						id: item.id,
						category: item.category,
						date: item.created_at
							? new Date(item.created_at).toLocaleDateString()
							: "N/A",
						title: item.title,
						description: item.content,
					}));
					setAnnouncements(dbData);
				} else {
					console.error("Data received is not an array:", data);
				}
			})
			.catch((err) => console.error("Error fetching announcements:", err));
	}, []);

	const combinedList = [...HARDCODED_ANNOUNCEMENTS, ...announcements];

	return (
		<div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
			{combinedList.map((item, index) => {
				const isExpanded = expandedId === item.id;
				return (
					<div key={item.id}>
						<div className="p-6 transition-colors hover:bg-slate-50">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600 uppercase">
										{item.category}
									</span>
									<span className="text-xs text-slate-400">{item.date}</span>
								</div>
								<h4 className="text-sm font-bold text-[#002B5B]">
									{item.title}
								</h4>
								<p
									className={`text-sm text-slate-600 leading-relaxed ${!isExpanded ? "line-clamp-2" : ""}`}
								>
									{item.description}
								</p>
								<button
									onClick={() => setExpandedId(isExpanded ? null : item.id)}
									className="text-xs font-semibold text-[#002B5B] hover:underline flex items-center gap-1 mt-2"
								>
									{isExpanded ? "Read Less" : "Read More"}
									{isExpanded ? (
										<ChevronDown size={14} />
									) : (
										<ChevronRight size={14} />
									)}
								</button>
							</div>
						</div>
						{index < combinedList.length - 1 && (
							<div className="h-px bg-slate-100 mx-6" />
						)}
					</div>
				);
			})}
		</div>
	);
}
