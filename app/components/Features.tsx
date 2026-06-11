"use client";
import React from "react";
import { BookOpen, Vote, Bell, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

const features = [
	{
		title: "Academic Resources",
		description:
			"Access a comprehensive library of lecture notes, clinical guides, and research materials tailored for dental students.",
		icon: BookOpen,
		color: "bg-blue-50 text-blue-600",
	},
	{
		title: "Secure Voting",
		description:
			"Participate in association elections through our transparent and secure blockchain-ready digital voting system.",
		icon: Vote,
		color: "bg-indigo-50 text-indigo-600",
	},
	{
		title: "Association Updates",
		description:
			"Stay informed with real-time notifications about seminars, clinical workshops, and social events in the association.",
		icon: Bell,
		color: "bg-teal-50 text-teal-600",
	},
];

export const Features = () => {
	return (
		<section className="py-24 bg-gray-50/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center max-w-3xl mx-auto mb-16">
					<h2 className="text-3xl font-bold text-[#0A192F] mb-4">
						Core Portal Features
					</h2>
					<p className="text-gray-600">
						Everything you need to navigate your journey as a dental student at
						the University of Lagos.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{features.map((feature, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group cursor-pointer"
						>
							<div
								className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
							>
								<feature.icon className="w-7 h-7" />
							</div>
							<h3 className="text-xl font-bold text-[#0A192F] mb-4">
								{feature.title}
							</h3>
							<p className="text-gray-600 mb-6 leading-relaxed">
								{feature.description}
							</p>
							<div className="flex items-center text-[#0A192F] font-semibold text-sm group-hover:gap-2 transition-all">
								Learn more <ArrowRight className="w-4 h-4 ml-1" />
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};
