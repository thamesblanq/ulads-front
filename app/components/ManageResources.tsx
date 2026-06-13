"use client";

import { useState, useEffect, useCallback } from "react";
import {
	Plus,
	Edit2,
	Trash2,
	X,
	Link as LinkIcon,
	RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Resource } from "@/types";

const BRAND_BLUE = "#002B5B";
const API_BASE_URL = "/api";

export function ManageResources() {
	const [resources, setResources] = useState<Resource[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [isFetching, setIsFetching] = useState(true);
	const [editingId, setEditingId] = useState<string | null>(null);

	const [formData, setFormData] = useState({
		title: "",
		course_code: "",
		class_level: "100L",
		drive_url: "",
	});

	const levels = ["100L", "200L", "300L", "400L", "500L", "600L"];

	// 1. Core Fetch Logic (Added credentials: "include")
	const fetchResources = useCallback(async () => {
		try {
			const res = await fetch(`${API_BASE_URL}/resources`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // Crucial for authentication!
			});

			if (res.ok) {
				const data = await res.json();
				setResources(data);
			} else {
				console.error("Failed to fetch resources. Status:", res.status);
			}
		} catch (error: unknown) {
			console.error("Network error while fetching resources:", error);
		}
	}, []);

	// 2. Initial Mount Effect
	useEffect(() => {
		let isMounted = true;

		const loadInitialData = async () => {
			await fetchResources();
			if (isMounted) setIsFetching(false);
		};

		loadInitialData();

		return () => {
			isMounted = false;
		};
	}, [fetchResources]);

	// 3. Helper for manual refreshes
	const refreshData = async () => {
		setIsFetching(true);
		await fetchResources();
		setIsFetching(false);
	};

	// 4. Handle Form Changes
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
	) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	// 5. Handle Submit (Added credentials: "include")
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);

		const url = editingId
			? `${API_BASE_URL}/resources/${editingId}`
			: `${API_BASE_URL}/resources`;

		const method = editingId ? "PATCH" : "POST";

		try {
			const res = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // Crucial for authentication!
				body: JSON.stringify(formData),
			});

			if (!res.ok) throw new Error("Failed to save resource");

			toast.success(
				`Resource successfully ${editingId ? "updated" : "created"}!`,
			);
			resetForm();
			refreshData();
		} catch (error: unknown) {
			console.error("Error saving resource:", error);
			toast.error("An error occurred. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	// 6. Handle Edit Trigger
	const handleEdit = (resource: Resource) => {
		setEditingId(resource.id);
		setFormData({
			title: resource.title,
			course_code: resource.course_code,
			class_level: resource.class_level,
			drive_url: resource.drive_url,
		});
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	// 7. Handle Delete (Added credentials: "include")
	const handleDelete = async (id: string) => {
		if (!window.confirm("Are you sure you want to delete this resource?"))
			return;

		try {
			const res = await fetch(`${API_BASE_URL}/resources/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // Crucial for authentication!
			});

			if (res.ok) {
				toast.success("Resource deleted successfully.");
				refreshData();
			} else {
				throw new Error("Failed to delete from server");
			}
		} catch (error: unknown) {
			console.error("Error deleting resource:", error);
			toast.error("Failed to delete resource.");
		}
	};

	// 8. Reset Form
	const resetForm = () => {
		setEditingId(null);
		setFormData({
			title: "",
			course_code: "",
			class_level: "100L",
			drive_url: "",
		});
	};

	return (
		<div className="space-y-8 bg-white p-6 border border-gray-200 rounded-xl">
			{/* Header */}
			<div>
				<h2 className="text-xl font-bold text-slate-900">
					Manage Academic Resources
				</h2>
				<p className="text-sm text-slate-500">
					Create, update, or remove Google Drive links for students.
				</p>
			</div>

			{/* Form Section */}
			<form
				onSubmit={handleSubmit}
				className="space-y-4 bg-slate-50 p-5 rounded-lg border border-slate-100"
			>
				<div className="flex justify-between items-center mb-2">
					<h3 className="font-semibold text-slate-700">
						{editingId ? "Update Resource" : "Add New Resource"}
					</h3>
					{editingId && (
						<button
							type="button"
							onClick={resetForm}
							className="text-slate-400 hover:text-slate-600 flex items-center gap-1 text-sm"
						>
							<X size={16} /> Cancel Edit
						</button>
					)}
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Title (e.g., Anatomy Past Questions)
						</label>
						<input
							required
							type="text"
							name="title"
							value={formData.title}
							onChange={handleChange}
							className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002B5B]"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Course Code
						</label>
						<input
							required
							type="text"
							name="course_code"
							value={formData.course_code}
							onChange={handleChange}
							className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002B5B]"
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Class Level
						</label>
						<select
							required
							name="class_level"
							value={formData.class_level}
							onChange={handleChange}
							className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002B5B] bg-white"
						>
							{levels.map((level) => (
								<option
									key={level}
									value={level}
								>
									{level}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-medium text-slate-700 mb-1">
							Google Drive URL
						</label>
						<input
							required
							type="url"
							name="drive_url"
							value={formData.drive_url}
							onChange={handleChange}
							className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002B5B]"
						/>
					</div>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className="mt-4 w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-md text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
					style={{ backgroundColor: BRAND_BLUE }}
				>
					{isLoading ? (
						<RefreshCw
							className="animate-spin"
							size={18}
						/>
					) : editingId ? (
						<Edit2 size={18} />
					) : (
						<Plus size={18} />
					)}
					{editingId ? "Save Changes" : "Create Resource"}
				</button>
			</form>

			{/* List Section */}
			<div>
				<h3 className="font-semibold text-slate-800 mb-4 border-b pb-2">
					Active Resources
				</h3>

				{isFetching ? (
					<div className="flex justify-center py-8">
						<RefreshCw className="animate-spin text-slate-400" />
					</div>
				) : resources.length === 0 ? (
					<p className="text-slate-500 text-sm text-center py-6">
						No resources found. Add one above.
					</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{resources.map((resource) => (
							<div
								key={resource.id}
								className="flex flex-col justify-between p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
							>
								<div>
									<div className="flex justify-between items-start">
										<h4 className="font-bold text-slate-900">
											{resource.course_code}
										</h4>
										<span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full font-medium">
											{resource.class_level}
										</span>
									</div>
									<p className="text-slate-600 text-sm mt-1 mb-3">
										{resource.title}
									</p>
								</div>

								<div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
									<a
										href={resource.drive_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-sm text-blue-600 hover:underline flex items-center gap-1"
									>
										<LinkIcon size={14} /> View Link
									</a>
									<div className="flex gap-2">
										<button
											onClick={() => handleEdit(resource)}
											className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
										>
											<Edit2 size={16} />
										</button>
										<button
											onClick={() => handleDelete(resource.id)}
											className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
										>
											<Trash2 size={16} />
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
