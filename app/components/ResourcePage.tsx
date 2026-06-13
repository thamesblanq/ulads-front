"use client";
import { Folder, ExternalLink } from "lucide-react";

const BRAND_BLUE = "#002B5B";

const resources = [
	{ id: "100L", label: "100L" },
	{ id: "200L", label: "200L" },
	{ id: "300L", label: "300L" },
	{ id: "400L", label: "400L" },
	{ id: "500L", label: "500L" },
	{ id: "600L", label: "600L" },
];

function ResourceCard({ label }: { label: string }) {
	return (
		<div
			className="flex flex-col items-start gap-3 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow"
			style={{ borderRadius: "12px" }}
		>
			<Folder
				size={32}
				fill={BRAND_BLUE}
				color={BRAND_BLUE}
				strokeWidth={1.5}
			/>
			<span
				className="text-gray-900 flex-1 w-full"
				style={{ fontWeight: 700, fontSize: "1.125rem" }}
			>
				{label}
			</span>
			<a
				href="#" // Replace with your Google Drive links later
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm transition-opacity hover:opacity-90"
				style={{ backgroundColor: BRAND_BLUE, fontWeight: 500 }}
			>
				<ExternalLink
					size={13}
					strokeWidth={2}
				/>
				Open Link
			</a>
		</div>
	);
}

export function ResourcePage() {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-slate-900">
					Academic Resources
				</h2>
				<p className="text-slate-500">
					Access study materials and past questions by level.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{resources.map((r) => (
					<ResourceCard
						key={r.id}
						label={r.label}
					/>
				))}
			</div>
		</div>
	);
}
