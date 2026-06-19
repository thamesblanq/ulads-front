"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import useSWR from "swr";
import { toast } from "sonner";
import {
	Home,
	BookOpen,
	Vote,
	CreditCard,
	Bell,
	MessageSquare,
	FileText,
	Menu,
	X,
	User,
	ShieldAlert,
	LogOut,
} from "lucide-react";
import { UserProfile } from "@/types";
import { DashboardShellSkeleton } from "./skeletons/DashboardShellSkeleton";

// 1. Create the SWR fetcher. credentials: "include" sends your JWT cookie!
const fetcher = (url: string) =>
	fetch(url, { credentials: "include" }).then((res) => {
		if (!res.ok) throw new Error("Failed to fetch user");
		return res.json();
	});

const LetterAvatar = ({
	email,
	size = "md",
}: {
	email: string;
	size?: "sm" | "md" | "lg";
}) => {
	const letter = email ? email.charAt(0).toUpperCase() : "U";
	const sizeClasses = {
		sm: "w-8 h-8 text-sm",
		md: "w-10 h-10 text-base",
		lg: "w-12 h-12 text-lg",
	};
	return (
		<div
			className={`${sizeClasses[size]} rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center border-2 border-white shadow-sm`}
		>
			{letter}
		</div>
	);
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	// 2. Client-Side Data Fetching
	const {
		data: user,
		error,
		isLoading,
	} = useSWR<UserProfile>(
		`${process.env.NEXT_PUBLIC_API_URL}/users/me`,
		fetcher,
	);

	// 3. Security Check: If token is dead/tampered, clear it and kick to login
	useEffect(() => {
		if (error) {
			// Silently hit logout to kill the bad cookie, preventing an infinite redirect loop
			fetch(`/api/auth/logout`, {
				method: "POST",
				credentials: "include",
			}).finally(() => {
				toast.error("Session expired. Please log in again.");
				router.push("/login");
			});
		}
	}, [error, router]);

	// 4. Instantly show the skeleton while waiting for the backend (or while redirecting)
	if (isLoading || error || !user) {
		return <DashboardShellSkeleton />;
	}

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await fetch(`/api/auth/logout`, {
				method: "POST",
				credentials: "include",
			});
			toast.success("Logged out!");
			router.push("/");
		} catch (error) {
			console.error("Logout failed:", error);
			toast.error("Logout failed.");
		} finally {
			setIsLoggingOut(false);
		}
	};

	const visibleNavItems = [
		{ icon: Home, label: "Dashboard", href: "/dashboard", visible: true },
		{
			icon: BookOpen,
			label: "Resources",
			href: "/dashboard/resources",
			visible: true,
		},
		{
			icon: Vote,
			label: "Elections",
			href: "/dashboard/elections",
			visible: true,
		},
		{
			icon: CreditCard,
			label: "Payments",
			href: "/dashboard/payments",
			visible: true,
		},
		{
			icon: Bell,
			label: "Announcements",
			href: "/dashboard/announcements",
			visible: true,
		},
		{
			icon: MessageSquare,
			label: "Messaging",
			href: "/dashboard/messaging",
			visible: true,
		},
		{
			icon: User,
			label: "Profile Settings",
			href: "/dashboard/profile",
			visible: true,
		},
		{
			icon: FileText,
			label: "Executive Minutes",
			href: "/dashboard/minutes",
			visible: user.role === "admin" || user.role === "superadmin",
		},
		{
			icon: ShieldAlert,
			label: "Admin Dashboard",
			href: "/dashboard/admin",
			visible: user.role === "superadmin",
		},
	].filter((i) => i.visible);

	const userName = user.is_profile_complete
		? user.full_name?.split(" ")[0]
		: user.email?.split("@")[0];

	return (
		<div className="flex h-screen bg-slate-50 font-sans">
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#002B5B] text-white transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				<div className="flex flex-col h-full">
					<div className="p-6 flex items-center justify-between">
						<h1 className="text-xl font-bold">ULADS Portal</h1>
						<button
							onClick={() => setIsSidebarOpen(false)}
							className="lg:hidden"
							aria-label="Close sidebar"
						>
							<X size={24} />
						</button>
					</div>
					<nav className="flex-1 px-4 space-y-1">
						{visibleNavItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								onClick={() => setIsSidebarOpen(false)}
								className={`flex items-center gap-3 px-4 py-3 rounded-lg ${pathname === item.href ? "bg-white/10" : "hover:bg-white/5"}`}
							>
								<item.icon size={20} /> {item.label}
							</Link>
						))}
					</nav>
					<div className="p-6 border-t border-white/10">
						<div className="flex items-center gap-3">
							<LetterAvatar email={user.email} />
							<div className="flex-1 truncate">
								<p className="font-semibold text-sm">{userName}</p>
								<p className="text-xs text-blue-200 capitalize">
									{user.role || "User"}
								</p>
							</div>
							<button
								onClick={handleLogout}
								disabled={isLoggingOut}
								aria-label="Logout"
							>
								<LogOut size={20} />
							</button>
						</div>
					</div>
				</div>
			</aside>
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				<header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 shadow-sm">
					<button
						className="lg:hidden p-2 text-slate-600"
						onClick={() => setIsSidebarOpen(true)}
						aria-label="Open sidebar"
					>
						<Menu size={24} />
					</button>
					<h2 className="text-lg font-semibold text-slate-800">
						{visibleNavItems.find((i) => i.href === pathname)?.label ||
							"Dashboard"}
					</h2>
					<div className="flex items-center gap-4">
						<Bell
							size={20}
							className="text-slate-500"
						/>
						<LetterAvatar
							email={user.email}
							size="sm"
						/>
					</div>
				</header>

				{/* Incomplete Profile Banner */}
				{user.is_profile_complete === false &&
					pathname !== "/dashboard/profile" && (
						<div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
							<div className="flex items-center gap-3">
								<ShieldAlert className="text-yellow-600 w-5 h-5 shrink-0" />
								<p className="text-sm text-yellow-800">
									Your profile is incomplete. Please update your details to
									fully access the portal.
								</p>
							</div>
							<Link
								href="/dashboard/profile"
								className="text-sm font-bold text-yellow-700 hover:text-yellow-900 underline whitespace-nowrap"
							>
								Complete Profile
							</Link>
						</div>
					)}

				<main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
