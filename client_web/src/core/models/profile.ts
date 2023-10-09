export interface ProfileModel {
	id: number;
	userId: number;
	firstName: string;
	lastName: string;
	language: string;
	theme: 'dark' | 'light' | 'system';
}
