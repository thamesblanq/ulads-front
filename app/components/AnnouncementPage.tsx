"use client";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import {
	Announcement,
	BackendAnnouncement,
	mapBackendAnnouncementToUI,
} from "../../types";

const HARDCODED_ANNOUNCEMENTS: Announcement[] = [
	{
		id: "h1",
		category: "Welcome",
		date: "May 1, 2026",
		title: "Welcome to ULADS Portal",
		description: "This is the official portal for all dental students.",
	},
];

export function AnnouncementPage({
	initialAnnouncements = [],
}: {
	initialAnnouncements?: BackendAnnouncement[];
}) {
	const [expandedId, setExpandedId] = useState<string | number | null>(null);

	// Map the raw server data using the helper
	const fetchedAnnouncements: Announcement[] = initialAnnouncements.map(
		mapBackendAnnouncementToUI,
	);

	const combinedList = [...HARDCODED_ANNOUNCEMENTS, ...fetchedAnnouncements];

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
