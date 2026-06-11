"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 👈 Imported useRouter
import { toast } from "sonner"; // 👈 Imported toast
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
	LogOut, // 👈 Imported the LogOut icon
} from "lucide-react";

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
	email,
	role,
}: {
	children: React.ReactNode;
	email: string;
	role: string;
}) {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false); // 👈 State to prevent double-clicks

	const pathname = usePathname();
	const router = useRouter();

	const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

	const displayName = email ? email.split("@")[0] : "Student";
	const capitalizedName =
		displayName.charAt(0).toUpperCase() + displayName.slice(1);

	const NAV_ITEMS = [
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
			visible: role === "admin" || role === "superadmin",
		},
		{
			icon: ShieldAlert,
			label: "Admin Dashboard",
			href: "/dashboard/admin",
			visible: role === "superadmin",
		},
	];

	const visibleNavItems = NAV_ITEMS.filter((item) => item.visible);

	// 👈 Here is the secure Logout Handler
	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			// Tell the NestJS backend to destroy the secure cookie
			const response = await fetch(
				`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
				},
			);

			if (!response.ok) throw new Error("Failed to log out");

			toast.success("Successfully logged out!");
			router.push("/"); // Kicks them back to the main homepage
		} catch (error) {
			console.error("Logout error:", error);
			// Even if the backend fails, we should still try to push them away from the dashboard
			router.push("/");
		} finally {
			setIsLoggingOut(false);
		}
	};

	return (
		<div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
					onClick={toggleSidebar}
				/>
			)}

			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#002B5B] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between p-6">
						<h1 className="text-2xl font-bold tracking-tight text-white">
							ULADS Portal
						</h1>
						<button
							className="lg:hidden text-white/70 hover:text-white"
							onClick={toggleSidebar}
						>
							<X size={24} />
						</button>
					</div>

					<nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
						{visibleNavItems.map((item) => {
							const isActive = pathname === item.href;
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setIsSidebarOpen(false)}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
										isActive
											? "bg-white/10 text-white font-semibold shadow-inner"
											: "text-white/70 hover:bg-white/5 hover:text-white"
									}`}
								>
									<item.icon
										size={20}
										className={isActive ? "text-blue-400" : ""}
									/>
									<span>{item.label}</span>
								</Link>
							);
						})}
					</nav>

					{/* 👈 Updated Footer with the Logout Button */}
					<div className="p-6 border-t border-white/10 bg-black/10">
						<div className="flex items-center justify-between gap-3">
							<div className="flex items-center gap-3 overflow-hidden">
								<LetterAvatar email={email} />
								<div className="flex-1 min-w-0">
									<p className="text-sm font-semibold text-white truncate">
										{capitalizedName}
									</p>
									<p className="text-xs text-blue-200 truncate capitalize">
										{role.toLowerCase()}
									</p>
								</div>
							</div>

							<button
								onClick={handleLogout}
								disabled={isLoggingOut}
								className="p-2 text-white/70 hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors"
								title="Log out"
							>
								<LogOut
									size={20}
									className={isLoggingOut ? "opacity-50" : ""}
								/>
							</button>
						</div>
					</div>
				</div>
			</aside>

			{/* Main Content Area */}
			<div className="flex-1 flex flex-col min-w-0 overflow-hidden">
				<header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 lg:px-8 shrink-0 shadow-sm z-10">
					<div className="flex items-center gap-4">
						<button
							className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
							onClick={toggleSidebar}
						>
							<Menu size={24} />
						</button>
						<h2 className="hidden lg:block text-lg font-semibold text-slate-800">
							{visibleNavItems.find((item) => item.href === pathname)?.label ||
								"Dashboard"}
						</h2>
					</div>

					<div className="flex items-center gap-4">
						<button className="p-2 text-slate-500 hover:text-[#002B5B] transition-colors relative">
							<Bell size={20} />
							<span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
						</button>
						<div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
						<div className="flex items-center gap-3">
							<span className="hidden sm:block text-sm font-medium text-slate-700">
								{capitalizedName}
							</span>
							<LetterAvatar
								email={email}
								size="sm"
							/>
						</div>
					</div>
				</header>

				<main className="flex-1 overflow-y-auto bg-slate-50 p-4 lg:p-8">
					{children}
				</main>
			</div>
		</div>
	);
}
