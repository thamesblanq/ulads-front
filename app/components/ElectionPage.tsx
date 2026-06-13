"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import Image from "next/image";
import { CandidateCard } from "./CandidateCard";
import { CountdownTimer } from "./CountdownTimer";
import { LiveStatsChart } from "./LiveStatsChart";
import { ActivityHistory } from "./ActivityHistory";

export interface Candidate {
	id: string;
	name: string;
	position: string;
	imageUrl: string;
	manifesto: string;
	votes?: number;
}

interface ManifestoModalProps {
	candidate: Candidate | null;
	onClose: () => void;
}

const DEFAULT_END_TIME = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

export function ElectionPage() {
	const [candidates, setCandidates] = useState<Candidate[]>([]);
	const [electionId, setElectionId] = useState<string | null>(null);
	const [electionEndTime, setElectionEndTime] =
		useState<Date>(DEFAULT_END_TIME);
	const [votedPositions, setVotedPositions] = useState<Set<string>>(new Set());
	const [manifestoCandidate, setManifestoCandidate] =
		useState<Candidate | null>(null);

	useEffect(() => {
		// 1. Fetch active election
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/elections/active`, {
			credentials: "include",
		})
			.then((res) => res.json())
			.then((data) => {
				if (!data) return;
				setElectionId(data.id);
				setElectionEndTime(new Date(data.endTime));
				setCandidates(data.candidates || []);

				// 2. Fetch what positions the user has already voted for
				return fetch(
					`${process.env.NEXT_PUBLIC_API_URL}/elections/${data.id}/has-voted`,
					{ credentials: "include" },
				);
			})
			.then((res) => res?.json())
			.then((votedPos) => setVotedPositions(new Set(votedPos)))
			.catch((err) => console.error("Data fetch error:", err));
	}, []);

	async function handleVote(candidate: Candidate) {
		if (!electionId) return;

		try {
			const res = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/elections/vote`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						election_id: electionId,
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

			// Update UI state to lock this position
			setVotedPositions((prev) => new Set(prev).add(candidate.position));
			toast.success("Vote recorded successfully!");
		} catch (err: unknown) {
			if (err instanceof Error) {
				console.error("Vote error:", err);
			} else {
				toast.error("You have already voted for this position.");
			}
		}
	}

	return (
		<div className="max-w-7xl mx-auto py-6 bg-[#f7f8fb]">
			<div className="mb-8">
				<div className="flex items-center gap-2 mb-1">
					<span className="text-xs uppercase tracking-widest text-gray-400">
						Academic Year 2025–2026
					</span>
					<span className="w-1 h-1 rounded-full bg-slate-300" />
					<span className="text-xs uppercase tracking-widest text-[#002B5B]">
						Open Election
					</span>
				</div>
				<h1 className="text-2xl font-bold text-gray-900">
					Student Council Elections
				</h1>
				<p className="text-gray-500 mt-1 text-sm">
					Review each candidate&apos;s platform and cast your vote.
				</p>
			</div>

			<div className="flex flex-col lg:flex-row gap-8 items-start">
				<div className="w-full lg:w-[70%]">
					<div className="flex items-center justify-between mb-5">
						<h2 className="font-semibold text-gray-800">Candidate Overview</h2>
						<span className="text-sm text-gray-400">
							{votedPositions.size} of {candidates.length || 0} votes cast
						</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{candidates.map((candidate) => (
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
						<CountdownTimer endTime={electionEndTime} />
					</div>
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
						<LiveStatsChart candidates={candidates} />
					</div>
					<div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
						<ActivityHistory />
					</div>
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
