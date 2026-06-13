import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";

const jakarta = Plus_Jakarta_Sans({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
	title: {
		default: "ULADS Portal",
		template: "%s | ULADS Portal",
	},
	description:
		"Official digital hub for the University of Lagos Association of Dental Students.",
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html
			lang="en"
			className="h-full"
			suppressHydrationWarning
		>
			<body
				className={cn("min-h-screen font-sans antialiased", jakarta.variable)}
			>
				{children}
				<Analytics />
				<Toaster
					richColors
					position="top-right"
				/>
			</body>
		</html>
	);
}
