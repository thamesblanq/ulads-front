"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
	initialUser,
}: {
	children: React.ReactNode;
	initialUser: UserProfile | null;
}) {
	// If middleware works, initialUser will never be null, but we keep this for safety
	const user = initialUser;

	const pathname = usePathname();
	const router = useRouter();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	if (!user) return null;

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
								<p className="font-semibold text-sm">
									{user.full_name?.split(" ")[0] || "Student"}
								</p>
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
				<main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
			</div>
		</div>
	);
}
