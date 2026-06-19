import DashboardPage from "../components/Dashboard";

export default function Page() {
	// 🧹 Cleaned up! No more async/await or server-side fetch locks.
	// The browser will render the page instantly and load data via SWR.
	return <DashboardPage />;
}
