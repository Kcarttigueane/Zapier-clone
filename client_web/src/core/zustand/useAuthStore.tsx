import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { BASE_URL, apiV2, getApiHeaders } from '../api';
import useUserStore from './useUserStore';

type AuthState = {
	isLoading: boolean;
};

type AuthActions = {
	loginFn: (email: string, password: string) => Promise<void>;
	registerFn: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
	logoutFn: () => void;
	loginWithGoogle: () => void;
	loginWithSpotify: () => void;
	loginWithGitHub: () => void;
	authorizeService: (provider: string, service: string) => Promise<void>;
};

const initialState: AuthState = {
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
		},
		loginWithGoogle: async () => {
			try {
				window.location.href = `${BASE_URL}/auth/login/google`;
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
		authorizeService: async (provider: string, service: string) => {
			const accessToken = localStorage.getItem('access_token');
			if (accessToken == null) {
				throw new Error('User token is null');
			}
			try {
				const response = await apiV2.get('/auth/authorize/' + provider + '/' + service, {
					headers: getApiHeaders(accessToken),
				});
				if (response.status === HttpStatusCode.Ok && response.data) {
					window.location.href = response.data;
				}
			} catch (error: any) {
				console.error('Error authorizing service:', error);
				throw error;
			}
		},
	};
});
