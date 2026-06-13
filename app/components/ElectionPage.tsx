"use client";
import { useState, useEffect } from "react";
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
	manifesto: string; // 👈 Updated type to string to accurately map your DB column
	votes?: number;
}

interface ManifestoModalProps {
	candidate: Candidate | null;
	onClose: () => void;
}

const DEFAULT_END_TIME = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);

const DEFAULT_CANDIDATES: Candidate[] = [
	{
		id: "1",
		name: "Alexandra Chen",
		position: "Student President",
		imageUrl:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
		manifesto:
			"Establish a student wellness fund with quarterly mental health workshops.\nIntroduce transparent budget reporting accessible to all students.\nPartner with local businesses for internship pipelines for graduating students.",
		votes: 312,
	},
	{
		id: "2",
		name: "Priya Okafor",
		position: "Vice President",
		imageUrl:
			"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400",
		manifesto:
			"Redesign academic advising with a peer-mentorship co-model.\nAdvocate for extended library hours during examination periods.\nDigitise all administrative forms to reduce bureaucratic friction.",
		votes: 278,
	},
];

export function ElectionPage() {
	const [candidates, setCandidates] = useState<Candidate[]>(DEFAULT_CANDIDATES);
	const [electionEndTime, setElectionEndTime] = useState<Date | null>(
		DEFAULT_END_TIME,
	);
	const [votedIds, setVotedIds] = useState<Set<string>>(new Set());
	const [manifestoCandidate, setManifestoCandidate] =
		useState<Candidate | null>(null);

	useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/elections/active`, {
			credentials: "include",
		})
			.then((res) => {
				if (!res.ok) throw new Error("Server response error");
				return res.json();
			})
			.then((data) => {
				if (data && data.endTime) {
					setElectionEndTime(new Date(data.endTime));
				}
				if (data && data.candidates && data.candidates.length > 0) {
					setCandidates(data.candidates);
				}
			})
			.catch((err) =>
				console.log(
					"Live active election data unavailable, using local mock defaults instead.",
					err,
				),
			);
	}, []);

	function handleVote(id: string) {
		setVotedIds((prev) => {
			const next = new Set(prev);
			next.add(id);
			return next;
		});
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
							{votedIds.size} of {candidates.length || 0} votes cast
						</span>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
						{candidates.map((candidate) => (
							<CandidateCard
								key={candidate.id}
								name={candidate.name}
								position={candidate.position}
								imageUrl={candidate.imageUrl}
								hasVoted={votedIds.has(candidate.id)}
								onVote={() => handleVote(candidate.id)}
								onViewManifesto={() => setManifestoCandidate(candidate)}
							/>
						))}
					</div>

					{candidates.length > 0 && (
						<div className="mt-6 bg-white rounded-2xl p-5 flex items-center gap-5 shadow-sm border border-slate-100">
							<div className="flex-1">
								<div className="flex items-center justify-between mb-2">
									<span className="text-sm text-gray-500">
										Your voting progress
									</span>
									<span className="text-sm font-semibold text-[#002B5B]">
										{votedIds.size} / {candidates.length}
									</span>
								</div>
								<div className="w-full h-2 rounded-full bg-[#002B5B]/10">
									<div
										className="h-2 rounded-full transition-all duration-500 bg-[#002B5B]"
										style={{
											width: `${(votedIds.size / candidates.length) * 100}%`,
										}}
									/>
								</div>
							</div>
							{votedIds.size === candidates.length && (
								<div className="shrink-0 text-sm px-4 py-2 rounded-xl text-white bg-[#00874a]">
									All votes submitted ✓
								</div>
							)}
						</div>
					)}
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
	useEffect(() => {
		if (candidate) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [candidate]);

	if (!candidate) return null;

	// 👈 Converts the text string field from your Neon DB into cleanly scannable lines
	const points = candidate.manifesto
		? candidate.manifesto.split("\n").filter((p) => p.trim() !== "")
		: [];

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/45 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="relative bg-white rounded-2xl p-8 max-w-md w-full shadow-[0_25px_60px_rgba(0,43,91,0.2)]"
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
						src={candidate.imageUrl || "/placeholders/avatar.png"}
						alt={candidate.name}
						className="w-14 h-14 rounded-full object-cover object-top"
						width={56}
						height={56}
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
					{points.length > 0 ? (
						points.map((point, i) => (
							<li
								key={i}
								className="flex items-start gap-3"
							>
								<span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white mt-0.5 bg-[#002B5B] text-[10px]">
									{i + 1}
								</span>
								<p className="text-gray-600 text-sm leading-snug">{point}</p>
							</li>
						))
					) : (
						<p className="text-sm text-slate-500 italic">
							No commitments listed in candidate registration.
						</p>
					)}
				</ul>
			</div>
		</div>
	);
}
