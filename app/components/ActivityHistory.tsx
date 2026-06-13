"use client";
import { CheckCircle2, Clock3, XCircle } from "lucide-react";

interface ActivityItem {
	id: string;
	election: string;
	action: string;
	date: string;
	status: "voted" | "pending" | "missed";
}

const activity: ActivityItem[] = [
	{
		id: "1",
		election: "Student Council 2024",
		action: "Voted for Class President",
		date: "Nov 12, 2024",
		status: "voted",
	},
	{
		id: "2",
		election: "Sports Committee 2024",
		action: "Voted for Sports Rep",
		date: "Sep 3, 2024",
		status: "voted",
	},
	{
		id: "3",
		election: "Cultural Board 2024",
		action: "Did not participate",
		date: "Jul 18, 2024",
		status: "missed",
	},
	{
		id: "4",
		election: "Academic Affairs 2023",
		action: "Voted for Secretary",
		date: "Mar 5, 2023",
		status: "voted",
	},
];

const statusConfig = {
	voted: {
		icon: CheckCircle2,
		color: "#00874a",
		bg: "rgba(0,200,100,0.08)",
	},
	pending: {
		icon: Clock3,
		color: "#b45309",
		bg: "rgba(251,191,36,0.12)",
	},
	missed: {
		icon: XCircle,
		color: "#b91c1c",
		bg: "rgba(239,68,68,0.08)",
	},
};

export function ActivityHistory() {
	return (
		<div>
			<div className="flex items-center gap-2 mb-4">
				<span
					className="text-xs uppercase tracking-widest text-gray-400"
					style={{ letterSpacing: "0.12em" }}
				>
					My Voting History
				</span>
			</div>

			<div className="flex flex-col gap-3">
				{activity.map((item) => {
					const { icon: Icon, color, bg } = statusConfig[item.status];
					return (
						<div
							key={item.id}
							className="flex items-start gap-3 p-3 rounded-xl"
							style={{ backgroundColor: "rgba(0,43,91,0.025)" }}
						>
							<div
								className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
								style={{ backgroundColor: bg }}
							>
								<Icon
									className="w-3.5 h-3.5"
									style={{ color }}
								/>
							</div>
							<div className="min-w-0 flex-1">
								<p
									className="text-gray-800 leading-snug truncate"
									style={{ fontSize: "0.8125rem" }}
								>
									{item.action}
								</p>
								<p className="text-xs text-gray-400 mt-0.5 truncate">
									{item.election}
								</p>
							</div>
							<span className="shrink-0 text-xs text-gray-400 mt-0.5">
								{item.date}
							</span>
						</div>
					);
				})}
			</div>
		</div>
	);
}
