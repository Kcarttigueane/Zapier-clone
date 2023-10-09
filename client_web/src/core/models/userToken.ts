export interface UserTokenModel {
	id: number;
	userId: number;
	tokenType: 'access' | 'refresh';
	tokenValue: string;
	expiresAt: Date;
}
