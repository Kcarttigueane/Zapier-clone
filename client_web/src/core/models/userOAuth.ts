export interface UserOAuthModel {
	id: number;
	userId: number;
	provider: 'Google' | 'Spotify' | 'Github' | string;
	providerUserId: string;
	authData: string;
}
