"use client";
import { useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import Image from "next/image";
import { CandidateCard } from "./CandidateCard";
import { CountdownTimer } from "./CountdownTimer";
import { LiveStatsChart } from "./LiveStatsChart";
import { ActivityHistory } from "./ActivityHistory";
import { ActiveElection, Candidate, ManifestoModalProps } from "../../types";

export function ElectionPage({
	initialElection,
	initialVotedPositions,
}: {
	initialElection: ActiveElection;
	initialVotedPositions: string[];
}) {
	const [election] = useState<ActiveElection | null>(initialElection);
	const [votedPositions, setVotedPositions] = useState<Set<string>>(
		new Set(initialVotedPositions),
	);

	const [manifestoCandidate, setManifestoCandidate] =
		useState<Candidate | null>(null);

	async function handleVote(candidate: Candidate) {
		if (!election?.id) return;

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/elections/vote`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						election_id: election.id,
						candidate_id: candidate.id,
						position: candidate.position,
					}),
					credentials: "include",
				},
			);

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || "Failed to vote");
			}

			setVotedPositions((prev) => new Set(prev).add(candidate.position));
			toast.success("Vote recorded successfully!");
		} catch (err: unknown) {
			if (err instanceof Error) {
				toast.error(err.message);
			}
		}
	}

	if (!election)
		return (
			<div className="p-8 text-center text-gray-500">
				No active elections at the moment.
			</div>
		);

	return (
		<div className="max-w-7xl mx-auto py-6 bg-[#f7f8fb]">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-gray-900">{election.title}</h1>
				<p className="text-gray-500 mt-1 text-sm">
					Review each candidate&apos;s platform and cast your vote.
				</p>
			</div>

			<div className="flex flex-col lg:flex-row gap-8 items-start">
				<div className="w-full lg:w-[70%]">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{election.candidates.map((candidate) => (
							<CandidateCard
								key={candidate.id}
								name={candidate.name}
								position={candidate.position}
								imageUrl={candidate.imageUrl}
								hasVoted={votedPositions.has(candidate.position)}
								onVote={() => handleVote(candidate)}
								onViewManifesto={() => setManifestoCandidate(candidate)}
							/>
						))}
					</div>
				</div>

				<div className="w-full lg:w-[30%] lg:sticky lg:top-6 flex flex-col gap-5">
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
						<CountdownTimer endTime={new Date(election.endTime)} />
					</div>
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
						<LiveStatsChart candidates={election.candidates} />
					</div>
					<ActivityHistory />
				</div>
			</div>

			<ManifestoModal
				candidate={manifestoCandidate}
				onClose={() => setManifestoCandidate(null)}
			/>
		</div>
	);
}

function ManifestoModal({ candidate, onClose }: ManifestoModalProps) {
	if (!candidate) return null;
	const points = candidate.manifesto
		? candidate.manifesto.split("\n").filter((p) => p.trim() !== "")
		: [];
	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/45 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					onClick={onClose}
					className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
				>
					<X className="w-5 h-5" />
				</button>
				<div className="flex items-center gap-4 mb-6">
					<Image
						src={candidate.imageUrl}
						alt={candidate.name}
						width={56}
						height={56}
						className="w-14 h-14 rounded-full object-cover object-top"
						unoptimized
					/>
					<div>
						<h2 className="text-gray-900 font-bold">{candidate.name}</h2>
						<span className="text-xs px-2.5 py-0.5 rounded-full bg-[#002B5B]/5 text-[#002B5B]">
							Running for: {candidate.position}
						</span>
					</div>
				</div>
				<h3 className="text-gray-700 mb-3 font-semibold text-sm">
					Key Commitments
				</h3>
				<ul className="flex flex-col gap-3">
					{points.map((point, i) => (
						<li
							key={i}
							className="flex items-start gap-3"
						>
							<span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white mt-0.5 bg-[#002B5B] text-[10px]">
								{i + 1}
							</span>
							<p className="text-gray-600 text-sm leading-snug">{point}</p>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
