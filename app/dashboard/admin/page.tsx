import { Metadata } from "next";
import { UserManagement } from "../../components/UserManagement";
import { CreateElectionForm } from "../../components/CreateElectionForm";
import { ManageResources } from "../../components/ManageResources"; // Import the new component
import { SystemAuditLogs } from "../../components/SystemAuditLogs";

export const metadata: Metadata = {
	title: "Administrative Hub | ULADS Portal",
	description:
		"Manage system configurations, control election lifecycles, assign candidates, and oversee audit vectors safely.",
};

export default function AdminDashboardPage() {
	return (
		<div className="max-w-7xl mx-auto space-y-12 py-4 animate-in fade-in duration-300">
			{/* Section 1: User Actions */}
			<UserManagement />

			{/* Section 2: Elections Logistics (The Brand New Block!) */}
			<section className="pt-8 border-t border-gray-200 space-y-6">
				<div>
					<h2 className="text-xl font-bold text-[#002B5B]">
						Elections Core Logistics
					</h2>
					<p className="text-xs text-gray-500">
						Configure election events, handle real-time candidate data entry,
						and configure hosted web flyers.
					</p>
				</div>
				<CreateElectionForm />
			</section>

			{/* Section 3: Academic Resources */}
			<section className="pt-8 border-t border-gray-200">
				<ManageResources />
			</section>

			{/* Section 4: Audit Trails */}
			<section className="pt-8 border-t border-gray-200">
				<SystemAuditLogs />
			</section>
		</div>
	);
}
