"use client";
import Image from "next/image";
import { FileText, CheckCircle } from "lucide-react";

interface CandidateCardProps {
	name: string;
	position: string;
	imageUrl: string;
	hasVoted: boolean;
	onVote: () => void;
	onViewManifesto: () => void;
}

export function CandidateCard({
	name,
	position,
	imageUrl,
	hasVoted,
	onVote,
	onViewManifesto,
}: CandidateCardProps) {
	return (
		<div
			className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4"
			style={{
				boxShadow:
					"0 4px 6px -1px rgba(0,0,0,0.06), 0 10px 30px -5px rgba(0,43,91,0.08)",
			}}
		>
			<div className="relative">
				{/* Fixed ring style using standard tailwind classes */}
				<div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#002B5B]/10">
					<Image
						src={imageUrl}
						alt={name}
						width={96}
						height={96}
						className="w-full h-full object-cover object-top"
					/>
				</div>
				{hasVoted && (
					<div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center bg-[#002B5B]">
						<CheckCircle className="w-4 h-4 text-white" />
					</div>
				)}
			</div>

			<div className="text-center">
				<h3 className="text-gray-900 font-medium">{name}</h3>
				<span className="inline-block mt-1.5 px-3 py-0.5 rounded-full text-xs bg-[#002B5B]/10 text-[#002B5B]">
					Running for: {position}
				</span>
			</div>

			<button
				onClick={onViewManifesto}
				className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
			>
				<FileText className="w-3.5 h-3.5" />
				View Manifesto
			</button>

			<button
				onClick={onVote}
				disabled={hasVoted}
				className="w-full py-2.5 rounded-xl text-white text-sm tracking-wide transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
				style={{
					backgroundColor: hasVoted ? "#4A6FA5" : "#002B5B",
					boxShadow: hasVoted ? "none" : "0 2px 8px rgba(0,43,91,0.35)",
				}}
			>
				{hasVoted ? "Vote Cast ✓" : "Cast Vote"}
			</button>
		</div>
	);
}
