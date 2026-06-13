export interface UserProfile {
	id: string;
	email: string;
	full_name: string;
	role: string;
	is_profile_complete: boolean;
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
