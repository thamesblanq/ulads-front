"use client";
import React from "react";
import Link from "next/link";
import { Stethoscope } from "lucide-react";
import { FaGithub, FaInstagram } from "react-icons/fa"; // 👈 New imports
import { FaXTwitter } from "react-icons/fa6"; // 👈 New import

export const Footer = () => {
	return (
		<footer className="bg-[#0A192F] text-white py-16">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid md:grid-cols-4 gap-12 mb-12 border-b border-white/10 pb-12">
					<div className="col-span-1 md:col-span-1">
						<div className="flex items-center gap-2 mb-6">
							<Stethoscope className="w-6 h-6 text-blue-400" />
							<span className="font-bold text-xl">ULADS</span>
						</div>
						<p className="text-gray-400 text-sm leading-relaxed">
							University of Lagos Association of Dental Students. Committed to
							excellence in dental education and student welfare.
						</p>
					</div>

					<div>
						<h4 className="font-bold mb-6">Quick Links</h4>
						<ul className="space-y-4 text-gray-400 text-sm">
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Executive Council
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Resources
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									News & Updates
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-bold mb-6">Support</h4>
						<ul className="space-y-4 text-gray-400 text-sm">
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Contact Us
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									FAQ
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Privacy Policy
								</a>
							</li>
							<li>
								<a
									href="#"
									className="hover:text-white transition-colors"
								>
									Terms of Service
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="font-bold mb-6">Follow Us</h4>
						<div className="flex gap-4">
							<Link
								href="https://x.com/thamesblanq"
								target="_blank"
								className="cursor-pointer w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
							>
								<FaXTwitter className="w-5 h-5" />
							</Link>
							<Link
								href="https://www.instagram.com/thamesblanq/"
								target="_blank"
								className="cursor-pointer w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
							>
								<FaInstagram className="w-5 h-5" />
							</Link>
							<Link
								href="https://github.com/thamesblanq"
								target="_blank"
								className="cursor-pointer w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors"
							>
								<FaGithub className="w-5 h-5" />
							</Link>
						</div>
					</div>
				</div>

				<div className="flex flex-col md:row justify-between items-center gap-4 text-gray-500 text-xs">
					<p>© 1983 - {new Date().getFullYear()} ULADS. All rights reserved.</p>
					<p>
						Designed for the next generation of dental excellence. Most of the
						links in this section are for demonstration purposes only.
					</p>
				</div>
			</div>
		</footer>
	);
};
