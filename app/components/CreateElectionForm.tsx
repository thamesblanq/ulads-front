"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
	PlusCircle,
	UserPlus,
	Image as ImageIcon,
	Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Election {
	id: string;
	title: string;
}

export function CreateElectionForm() {
	// --- Election Creation State ---
	const [title, setTitle] = useState("");
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	// --- Candidate Add State ---
	const [elections, setElections] = useState<Election[]>([]);
	const [targetElectionId, setTargetElectionId] = useState("");
	const [candidateEmail, setCandidateEmail] = useState("");
	const [position, setPosition] = useState("");
	const [manifesto, setManifesto] = useState("");
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [isRegistering, setIsRegistering] = useState(false);

	// 1. Fetch ALL elections
	const fetchElections = useCallback(async () => {
		try {
			// Ensure your backend has a route /elections/all that uses getAllElections()
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/elections/all`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				},
			);

			if (response.ok) {
				const data = await response.json();
				setElections(data);

				// Auto-select first if available
				if (data.length > 0 && !targetElectionId) {
					setTargetElectionId(data[0].id);
				}
			}
		} catch (error) {
			console.error("Failed to load elections list", error);
		}
	}, [targetElectionId]);

	useEffect(() => {
		// Define an async function inside the effect
		const loadInitialData = async () => {
			await fetchElections();
		};

		loadInitialData();
	}, [fetchElections]);

	// 2. Handle Create Election
	const handleCreateElection = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!title || !startTime || !endTime) return;
		setIsCreating(true);

		try {
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/elections`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						title,
						start_time: startTime,
						end_time: endTime,
					}),
				},
			);

			if (!response.ok) throw new Error("Could not create election.");
			const data = await response.json();

			toast.success("Election successfully scheduled!");
			setTitle("");
			setStartTime("");
			setEndTime("");
			await fetchElections();
			setTargetElectionId(data.id);
		} catch (error: unknown) {
			toast.error(
				error instanceof Error ? error.message : "Election creation failed.",
			);
		} finally {
			setIsCreating(false);
		}
	};

	// 3. Handle Register Candidate
	const handleRegisterCandidate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!targetElectionId || !candidateEmail || !position) return;
		setIsRegistering(true);

		let uploadedImageUrl = "/placeholders/avatar.png";
		let actualUserId = "";

		try {
			// STEP 1: Verify Email and get User ID
			const usersResponse = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/users/search-by-email?email=${encodeURIComponent(candidateEmail.trim())}`,
				{
					method: "GET",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				},
			);

			if (!usersResponse.ok)
				throw new Error("User not found or access denied.");
			const matchedUser = await usersResponse.json();
			actualUserId = matchedUser.id;

			// STEP 2: Upload to Cloudinary
			if (imageFile) {
				const imgPayload = new FormData();
				imgPayload.append("file", imageFile);
				imgPayload.append("upload_preset", "ulads_candidates");

				const imgResponse = await fetch(
					`https://api.cloudinary.com/v1_1/dezvvevaf/image/upload`,
					{ method: "POST", body: imgPayload },
				);

				if (!imgResponse.ok) throw new Error("Cloudinary image upload failed.");
				const imgData = await imgResponse.json();
				uploadedImageUrl = imgData.secure_url;
			}

			// STEP 3: Link to election
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/elections/${targetElectionId}/candidates`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						user_id: actualUserId,
						position,
						manifesto,
						image_url: uploadedImageUrl,
					}),
				},
			);

			if (!response.ok)
				throw new Error("Failed to link candidate to election.");

			toast.success("Candidate successfully registered!");
			setCandidateEmail("");
			setPosition("");
			setManifesto("");
			setImageFile(null);
			const fileInput = document.getElementById(
				"candidate-image",
			) as HTMLInputElement;
			if (fileInput) fileInput.value = "";
		} catch (error: unknown) {
			toast.error(
				error instanceof Error ? error.message : "Candidate addition failed.",
			);
		} finally {
			setIsRegistering(false);
		}
	};

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
			{/* Form A: Schedule Election */}
			<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
				<h3 className="text-lg font-bold text-[#002B5B] flex items-center gap-2">
					<PlusCircle className="size-5" /> Schedule New Election
				</h3>
				<form
					onSubmit={handleCreateElection}
					className="space-y-4"
				>
					<div>
						<label className="text-xs font-semibold text-gray-500 block mb-1">
							Election Title
						</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="e.g., ULADS 2026 Executive Election"
							className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#002B5B]"
							required
						/>
					</div>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="text-xs font-semibold text-gray-500 block mb-1">
								Start Timestamp
							</label>
							<input
								type="datetime-local"
								value={startTime}
								onChange={(e) => setStartTime(e.target.value)}
								className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#002B5B]"
								required
							/>
						</div>
						<div>
							<label className="text-xs font-semibold text-gray-500 block mb-1">
								End Timestamp
							</label>
							<input
								type="datetime-local"
								value={endTime}
								onChange={(e) => setEndTime(e.target.value)}
								className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#002B5B]"
								required
							/>
						</div>
					</div>
					<button
						type="submit"
						disabled={isCreating}
						className="w-full py-2.5 bg-[#002B5B] hover:bg-[#001c3d] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
					>
						{isCreating ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							"Create Base Election"
						)}
					</button>
				</form>
			</div>

			{/* Form B: Add Candidate */}
			<div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
				<h3 className="text-lg font-bold text-[#002B5B] flex items-center gap-2">
					<UserPlus className="size-5" /> Add Candidate Pointers
				</h3>
				<form
					onSubmit={handleRegisterCandidate}
					className="space-y-3"
				>
					<div className="grid grid-cols-2 gap-3">
						<select
							value={targetElectionId}
							onChange={(e) => setTargetElectionId(e.target.value)}
							className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-xs focus:border-[#002B5B] bg-white cursor-pointer"
							required
						>
							<option
								value=""
								disabled
							>
								Select Target Election...
							</option>
							{elections.map((election) => (
								<option
									key={election.id}
									value={election.id}
								>
									{election.title}
								</option>
							))}
						</select>
						<input
							type="email"
							value={candidateEmail}
							onChange={(e) => setCandidateEmail(e.target.value)}
							placeholder="Candidate Email"
							className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-xs focus:border-[#002B5B]"
							required
						/>
					</div>
					<div className="grid grid-cols-2 gap-3 items-center">
						<input
							type="text"
							value={position}
							onChange={(e) => setPosition(e.target.value)}
							placeholder="Position (e.g., President)"
							className="w-full px-4 py-2.5 border border-gray-200 rounded-xl outline-none text-xs focus:border-[#002B5B]"
							required
						/>
						<label className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors text-xs text-gray-600">
							<ImageIcon className="size-4 text-gray-400 shrink-0" />
							<span className="truncate">
								{imageFile ? imageFile.name : "Upload Image"}
							</span>
							<input
								id="candidate-image"
								type="file"
								accept="image/*"
								onChange={(e) => setImageFile(e.target.files?.[0] || null)}
								className="hidden"
							/>
						</label>
					</div>
					<textarea
						value={manifesto}
						onChange={(e) => setManifesto(e.target.value)}
						placeholder="Campaign Manifesto commitments..."
						className="w-full h-20 p-3 border border-gray-200 rounded-xl outline-none text-xs focus:border-[#002B5B] resize-none"
					/>
					<button
						type="submit"
						disabled={isRegistering}
						className="w-full py-2.5 bg-[#00874a] hover:bg-[#006637] text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
					>
						{isRegistering ? (
							<Loader2 className="size-4 animate-spin" />
						) : (
							"Link Candidate & Image"
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
