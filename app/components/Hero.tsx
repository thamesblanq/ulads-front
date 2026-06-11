"use client";
import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/ImageWithFallback";

const HERO_IMAGE =
	"https://images.unsplash.com/photo-1657470179447-0f5aa16daa91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZW50aXN0cnklMjB1bml2ZXJzaXR5JTIwc3R1ZGVudCUyMGNsaW5pY3xlbnwxfHx8fDE3ODA4NTcyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080";

export const Hero = () => {
	return (
		<section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0A192F] leading-[1.1] mb-6">
							Welcome to the <br />
							<span className="text-blue-600">ULADS Portal</span>
						</h1>
						<p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
							The official digital hub for the University of Lagos Association
							of Dental Students. Empowering the next generation of dental
							professionals through collaboration and excellence.
						</p>
						<div className="flex flex-col sm:flex-row gap-4">
							<Link
								href="/signup"
								className="inline-flex items-center justify-center px-8 py-4 bg-[#0A192F] text-white font-bold rounded-xl hover:bg-[#112240] transition-all shadow-lg hover:shadow-xl active:scale-95 group"
							>
								Register as a Student
								<ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Link>
							<Link
								href="/about"
								className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0A192F] font-bold rounded-xl border-2 border-gray-100 hover:border-[#0A192F] transition-all active:scale-95"
							>
								Learn More
							</Link>
						</div>

						<div className="mt-12 flex items-center gap-6">
							<div className="flex -space-x-3">
								{[1, 2, 3, 4].map((i) => (
									<div
										key={i}
										className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"
									>
										<ImageWithFallback
											src={`https://i.pravatar.cc/150?u=ulads${i}`}
											alt="Student"
											width={88}
											height={88}
											// priority removed from here!
										/>
									</div>
								))}
							</div>
							<p className="text-sm text-gray-500">
								Join <span className="font-bold text-[#0A192F]">500+</span>{" "}
								dental students
							</p>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="mt-16 lg:mt-0 relative"
					>
						<div className="relative rounded-2xl overflow-hidden shadow-2xl w-full h-[400px] lg:h-[500px]">
							<ImageWithFallback
								src={HERO_IMAGE}
								alt="ULADS Dental Clinic"
								fill
								priority // 👈 Added exactly where it needs to be!
								sizes="(max-w-7xl) 50vw, 100vw"
								className="object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-[#0A192F]/40 to-transparent" />
						</div>

						{/* Decorative elements */}
						<div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl hidden md:block border border-gray-50">
							<div className="flex items-center gap-4">
								<div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
									<span className="text-blue-600 font-bold">100%</span>
								</div>
								<div>
									<p className="text-sm font-bold text-[#0A192F]">Excellence</p>
									<p className="text-xs text-gray-500">Academic Standard</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};
