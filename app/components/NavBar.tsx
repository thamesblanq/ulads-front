"use client";
import Link from "next/link";
import { Stethoscope } from "lucide-react";

export const NavBar = () => {
	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-20">
					<Link
						href="/"
						className="flex items-center gap-2 group cursor-pointer"
					>
						<div className="bg-[#0A192F] p-2 rounded-lg transition-transform group-hover:scale-110">
							<Stethoscope className="w-6 h-6 text-white" />
						</div>
						<span className="text-[#0A192F] font-bold text-xl tracking-tight">
							ULADS
						</span>
					</Link>

					<div className="flex items-center gap-4">
						<Link
							href="/login"
							className="px-5 py-2.5 text-[#0A192F] font-semibold hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
						>
							Login
						</Link>
						<Link
							href="/signup"
							className="px-6 py-2.5 bg-[#0A192F] text-white font-semibold rounded-lg hover:bg-[#112240] transition-all shadow-sm active:scale-95 cursor-pointer"
						>
							Sign Up
						</Link>
					</div>
				</div>
			</div>
		</nav>
	);
};
