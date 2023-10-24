interface UserProfileDTO {
	first_name?: string;
	last_name?: string;
	language: string;
	theme: 'dark' | 'light' | 'system';
}

enum UserRole {
	USER = 'USER',
	ADMIN = 'ADMIN',
}

export interface UserModelDTO {
	id: string;
	email: string;
	status: 'active' | 'inactive' | 'suspended';
	role: UserRole;
	email_verified: boolean;
	profile: UserProfileDTO;
	created_at: Date;
	updated_at: Date;
}
