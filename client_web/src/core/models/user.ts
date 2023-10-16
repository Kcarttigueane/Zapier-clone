export interface UserModel {
	id: number;
	email: string;
	passwordHash: string;
	status: 'active' | 'inactive' | 'suspended';
	emailVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}
