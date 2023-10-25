import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { BASE_URL, apiV2 } from '../api';
import useUserStore from './useUserStore';

type AuthState = {
	accessToken?: string;
	isLoading: boolean;
};

type AuthActions = {
	loginFn: (email: string, password: string) => Promise<void>;
	registerFn: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
	logoutFn: () => void;
	loginWithGoogle: () => void;
	loginWithSpotify: () => void;
	loginWithGitHub: () => void;
	authorizeGoogleService: (service: string) => void;
	authorizeSpotifyService: () => void;
	authorizeDiscordService: () => void;
};

const initialState: AuthState = {
	accessToken: undefined,
	isLoading: false,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => {
	return {
		...initialState,
		loginFn: async (email, password) => {
			set({ isLoading: true });
			try {
				const formData = new URLSearchParams();
				formData.append('username', email);
				formData.append('password', password);

				const response = await apiV2.post('/auth/token', formData, {
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				});

				if (response.status === HttpStatusCode.Ok && response.data) {
					const { accessToken } = response.data;
					set({ accessToken: accessToken });
					try {
						set({ isLoading: true });
						await useUserStore.getState().fetchCurrentUser(accessToken);
						localStorage.setItem('access_token', accessToken);
					} catch (error: any) {
						console.error('Error fetching current user:', error);
						throw error;
					} finally {
						set({ isLoading: false });
					}
				}
			} catch (error: any) {
				throw error;
			} finally {
				set({ isLoading: false });
			}
		},
		registerFn: async (firstName, lastName, email, password) => {
			set({ isLoading: true });
			try {
				const newUser = {
					email: email,
					password: password,
					profile: {
						first_name: firstName,
						last_name: lastName,
					},
				};

				const response = await apiV2.post('/auth/register', newUser);

				if (response.status === HttpStatusCode.Ok && response.data) {
					const { accessToken } = response.data;
					set({ accessToken: accessToken });

					try {
						set({ isLoading: true });
						await useUserStore.getState().fetchCurrentUser(accessToken);
						localStorage.setItem('access_token', accessToken);
					} catch (error: any) {
						console.error('Error fetching current user:', error);
						throw error;
					} finally {
						set({ isLoading: false });
					}
				}
			} catch (error: any) {
				console.error('Error registering user:', error);
				set({ isLoading: false });
				throw error;
			} finally {
				set({ isLoading: false });
			}
		},
		logoutFn: () => {
			localStorage.removeItem('access_token');
			useUserStore.getState().clearUser();
			set({ accessToken: undefined, isLoading: false });
		},
		loginWithGoogle: async () => {
			try {
				window.location.href = 'http://0.0.0.0:8080/api/v2/auth/login/google';
			} catch (error) {
				console.error('Login with Google failed:', error);
			}
		},
		loginWithSpotify: () => {
			window.location.href = `${BASE_URL}/auth/login/spotify`;
		},
		loginWithGitHub: () => {
			window.location.href = `${BASE_URL}/auth/login/github`;
		},
		authorizeGoogleService: (service: string) => {
			const userToken = localStorage.getItem('access_token');
			window.location.href = `${BASE_URL}/services/google/${service}?token=${userToken}`;
		},
		authorizeSpotifyService: () => {
			const userToken = localStorage.getItem('access_token');
			window.location.href = `${BASE_URL}/services/spotify?token=${userToken}`;
		},
		authorizeDiscordService: () => {
			const userToken = localStorage.getItem('access_token');
			window.location.href = `${BASE_URL}/services/discord?token=${userToken}`;
		},
	};
});
