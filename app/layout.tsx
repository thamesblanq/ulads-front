import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // 👈 1. Import the modern font
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

// 2. Configure the font and name the variable exactly what CSS expects
const jakarta = Plus_Jakarta_Sans({
	variable: "--font-sans", // 👈 Changed to match globals.css!
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: "ULADS Portal",
	description: "University of Lagos Association of Dental Students",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${jakarta.variable} h-full antialiased`}
		>
			{/* 3. Added font-sans here to ensure it applies globally */}
			<body className="min-h-full flex flex-col font-sans">
				{children}
				<Toaster
					richColors
					position="top-right"
				/>
			</body>
		</html>
	);
}
