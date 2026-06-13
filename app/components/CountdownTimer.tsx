import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

export function CountdownTimer({ endTime }: { endTime: Date | null }) {
	const [timeLeft, setTimeLeft] = useState({
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
	});

	useEffect(() => {
		if (!endTime) return;
		const tick = () => {
			const diff = Math.max(0, endTime.getTime() - Date.now());
			setTimeLeft({
				days: Math.floor(diff / 86400000),
				hours: Math.floor((diff % 86400000) / 3600000),
				minutes: Math.floor((diff % 3600000) / 60000),
				seconds: Math.floor((diff % 60000) / 1000),
			});
		};
		tick();
		const id = setInterval(tick, 1000);
		return () => clearInterval(id);
	}, [endTime]);

	const pad = (n: number) => String(n).padStart(2, "0");

	if (!endTime)
		return <div className="text-sm text-slate-500">Loading timer...</div>;

	return (
		<div>
			<div className="flex items-center gap-2 mb-4">
				<Clock className="w-4 h-4 text-[#002B5B]" />
				<span className="text-xs uppercase tracking-widest text-gray-400">
					Election Closes In
				</span>
			</div>
			<div className="grid grid-cols-4 gap-2">
				{[
					{ l: "Days", v: timeLeft.days },
					{ l: "Hours", v: timeLeft.hours },
					{ l: "Mins", v: timeLeft.minutes },
					{ l: "Secs", v: timeLeft.seconds },
				].map(({ l, v }) => (
					<div
						key={l}
						className="flex flex-col items-center rounded-xl py-3 bg-[#002B5B]/5"
					>
						<span className="tabular-nums text-2xl font-bold text-[#002B5B] leading-none">
							{pad(v)}
						</span>
						<span className="text-xs text-gray-400 mt-1">{l}</span>
					</div>
				))}
			</div>
		</div>
	);
}
