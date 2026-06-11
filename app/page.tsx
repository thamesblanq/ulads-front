import React from "react";
import { NavBar } from "./components/NavBar";
import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Footer } from "./components/Footer";

export default function Home() {
	return (
		<div className="min-h-screen bg-white font-sans">
			<NavBar />
			<Hero />
			<Features />
			<Footer />
		</div>
	);
}
