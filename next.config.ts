import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "images.unsplash.com",
			},
			{
				protocol: "https",
				hostname: "i.pravatar.cc",
			},
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	// 👇 Here is the magical bridge!
	async rewrites() {
		return [
			{
				// Intercept any browser request starting with /api
				source: "/api/:path*",
				// Forward it secretly to NestJS
				destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
			},
		];
	},
};

export default nextConfig;
