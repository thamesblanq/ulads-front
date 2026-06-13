"use client";
import { Folder, ExternalLink } from "lucide-react";
import { Resource } from "@/types"; // Ensure you import your Resource type

const BRAND_BLUE = "#002B5B";

function ResourceCard({ resource }: { resource: Resource }) {
	return (
		<div className="flex flex-col items-start gap-3 p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
			<Folder
				size={32}
				fill={BRAND_BLUE}
				color={BRAND_BLUE}
				strokeWidth={1.5}
			/>
			<div className="flex-1 w-full">
				<p className="font-bold text-lg text-gray-900">
					{resource.course_code}
				</p>
				<p className="text-sm text-gray-500">{resource.title}</p>
			</div>
			<a
				href={resource.drive_url}
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-white text-sm hover:opacity-90"
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

export function ResourcePage({
	initialResources,
}: {
	initialResources: Resource[];
}) {
	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold text-slate-900">
					Academic Resources
				</h2>
				<p className="text-slate-500">
					Access study materials and past questions.
				</p>
			</div>

			{initialResources.length === 0 ? (
				<p className="text-slate-500">No resources available at this level.</p>
			) : (
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
					{initialResources.map((r) => (
						<ResourceCard
							key={r.id}
							resource={r}
						/>
					))}
				</div>
			)}
		</div>
	);
}
