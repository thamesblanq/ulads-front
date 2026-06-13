"use client";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import { Candidate } from "../../types";

interface TooltipItem {
	value: number | string;
	name?: string;
}

interface CustomTooltipProps {
	active?: boolean;
	payload?: TooltipItem[];
	label?: string;
}

const COLORS = ["#002B5B", "#1a4a82", "#2d6aad", "#4a8ec9"];

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
	if (active && payload && payload.length) {
		return (
			<div
				className="rounded-lg px-3 py-2 text-white text-xs"
				style={{ backgroundColor: "#002B5B" }}
			>
				<p className="font-medium">{label}</p>
				<p>{payload[0].value} votes</p>
			</div>
		);
	}
	return null;
};

export function LiveStatsChart({ candidates }: { candidates: Candidate[] }) {
	const chartData = candidates.map((c) => ({
		name: c.name
			.split(" ")
			.map((n, i) => (i === 0 ? n[0] + "." : n))
			.join(" "),
		votes: c.votes || 0,
	}));

	return (
		<div>
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-2">
					<TrendingUp
						className="w-4 h-4"
						style={{ color: "#002B5B" }}
					/>
					<span
						className="text-xs uppercase tracking-widest text-gray-400"
						style={{ letterSpacing: "0.12em" }}
					>
						Live Stats
					</span>
				</div>
				<span
					className="flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full"
					style={{ backgroundColor: "rgba(0,200,100,0.1)", color: "#00874a" }}
				>
					<span
						className="w-1.5 h-1.5 rounded-full animate-pulse"
						style={{ backgroundColor: "#00a85a" }}
					/>
					Live
				</span>
			</div>

			<ResponsiveContainer
				width="100%"
				height={140}
			>
				<BarChart
					data={chartData}
					margin={{ top: 4, right: 4, bottom: 4, left: -24 }}
				>
					<XAxis
						dataKey="name"
						tick={{ fontSize: 10, fill: "#9ca3af" }}
						axisLine={false}
						tickLine={false}
					/>
					<YAxis
						tick={{ fontSize: 10, fill: "#9ca3af" }}
						axisLine={false}
						tickLine={false}
					/>
					<Tooltip
						content={<CustomTooltip />}
						cursor={{ fill: "rgba(0,43,91,0.04)" }}
					/>
					<Bar
						dataKey="votes"
						radius={[4, 4, 0, 0]}
					>
						{chartData.map((_, i) => (
							<Cell
								key={i}
								fill={COLORS[i % COLORS.length]}
							/>
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>

			<div className="mt-2 flex justify-between text-xs text-gray-400">
				<span>1,026 total votes cast</span>
				<span>68% turnout</span>
			</div>
		</div>
	);
}
