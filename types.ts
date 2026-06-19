export interface UserProfile {
	id: string;
	email: string;
	full_name: string;
	matric?: string;
	level?: string | number;
	graduation_year?: string | number;
	role: string;
	isSuspended: boolean;
	avatar: string;
	is_profile_complete: boolean;
}

export interface ManifestoModalProps {
	candidate: Candidate | null;
	onClose: () => void;
}

export interface Candidate {
	id: string;
	name: string;
	position: string;
	imageUrl: string;
	manifesto: string;
	votes: number;
}

export interface ActiveElection {
	id: string;
	title: string;
	endTime: string;
	candidates: Candidate[];
}

// 1. The interface for your UI component
export interface Announcement {
	id: string | number;
	category: string;
	date: string;
	title: string;
	description: string;
}

// 2. The interface for the raw data from your NestJS Backend
export interface BackendAnnouncement {
	id: string;
	category: string;
	created_at: string; // The database field
	title: string;
	content: string; // The database field
}

// types.ts (add this helper)
export const mapBackendAnnouncementToUI = (
	item: BackendAnnouncement,
): Announcement => ({
	id: item.id,
	category: item.category,
	date: item.created_at
		? new Date(item.created_at).toLocaleDateString()
		: "N/A",
	title: item.title,
	description: item.content,
});

export interface SystemLog {
	id: string | number;
	date: string;
	email: string;
	role: string;
	route: string;
	action: string;
	status: number;
}

export interface Resource {
	id: string;
	title: string;
	course_code: string;
	class_level: string;
	drive_url: string;
}
