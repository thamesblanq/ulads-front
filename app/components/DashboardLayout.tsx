"use client";

import React, { useEffect, useState } from "react";
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
	X,
	User,
	ShieldAlert,
	LogOut,
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
}: {
	children: React.ReactNode;
}) {
	const [user, setUser] = useState<{
		email: string;
		role: string;
		full_name: string;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [isLoggingOut, setIsLoggingOut] = useState(false);

	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
					credentials: "include",
				});
				if (!res.ok) throw new Error("Unauthorized");
				const data = await res.json();
				setUser(data);
			} catch (err) {
				console.error("Failed to fetch user:", err);
				toast.error("Session expired. Please log in again.");
				router.push("/login");
			} finally {
				setIsLoading(false);
			}
		};
		fetchUser();
	}, [router]);

	const handleLogout = async () => {
		setIsLoggingOut(true);
		try {
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
				method: "POST",
				credentials: "include",
			});
			toast.success("Successfully logged out!");
			router.push("/");
		} catch (error) {
			console.error("Logout failed:", error);
			toast.error("Logout failed. Please try again.");
			router.push("/");
		} finally {
			setIsLoggingOut(false);
		}
	};

	if (isLoading) {
		return (
			<div className="h-screen flex items-center justify-center">
				Loading...
			</div>
		);
	}

	if (!user) return null;

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
			visible: user.role === "admin" || user.role === "superadmin",
		},
		{
			icon: ShieldAlert,
			label: "Admin Dashboard",
			href: "/dashboard/admin",
			visible: user.role === "superadmin",
		},
	];

	const visibleNavItems = NAV_ITEMS.filter((item) => item.visible);

	return (
		<div className="flex h-screen bg-slate-50 font-sans">
			{/* Sidebar */}
			<aside
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#002B5B] text-white transition-transform lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
			>
				<div className="flex flex-col h-full">
					<div className="p-6 flex items-center justify-between">
						<h1 className="text-xl font-bold">ULADS Portal</h1>
						<button
							onClick={() => setIsSidebarOpen(false)}
							className="lg:hidden"
						>
							<X size={24} />
						</button>
					</div>
					<nav className="flex-1 px-4 space-y-1">
						{visibleNavItems.map((item) => (
							<Link
								key={item.href}
								href={item.href}
								className={`flex items-center gap-3 px-4 py-3 rounded-lg ${pathname === item.href ? "bg-white/10" : "hover:bg-white/5"}`}
							>
								<item.icon size={20} />
								{item.label}
							</Link>
						))}
					</nav>
					<div className="p-6 border-t border-white/10">
						<div className="flex items-center gap-3">
							<LetterAvatar email={user.email} />
							<div className="flex-1 truncate">
								<p className="font-semibold text-sm">
									{user.full_name.split(" ")[0]}
								</p>
								<p className="text-xs text-blue-200 capitalize">{user.role}</p>
							</div>
							<button
								onClick={handleLogout}
								disabled={isLoggingOut}
							>
								<LogOut size={20} />
							</button>
						</div>
					</div>
				</div>
			</aside>

			{/* Main Content */}
			<main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
		</div>
	);
}
