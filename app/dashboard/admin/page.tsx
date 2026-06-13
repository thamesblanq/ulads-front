import { cookies } from "next/headers";
import { UserManagement } from "../../components/UserManagement";
import { CreateElectionForm } from "../../components/CreateElectionForm";
import { ManageResources } from "../../components/ManageResources";
import { SystemAuditLogs } from "../../components/SystemAuditLogs";
import { Suspense } from "react";
import { AuditSkeleton } from "@/app/components/AuditSkeleton";

export default async function AdminDashboardPage() {
	const cookieStore = await cookies();
	const token = cookieStore.get("jwt");

	// Fetch elections on the server
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/elections/all`, {
		headers: { Cookie: token ? `jwt=${token.value}` : "" },
		cache: "no-store",
	});

	const elections = res.ok ? await res.json() : [];

	return (
		<div className="max-w-7xl mx-auto space-y-12 py-4 animate-in fade-in duration-300">
			<UserManagement />
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
				<CreateElectionForm initialElections={elections} />
			</section>
			<section className="pt-8 border-t border-gray-200">
				<ManageResources />
			</section>
			<section className="pt-8 border-t border-gray-200">
				<Suspense fallback={<AuditSkeleton />}>
					<SystemAuditLogs />
				</Suspense>
			</section>
		</div>
	);
}
