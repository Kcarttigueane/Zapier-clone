import { create } from 'zustand';
import { UserModel } from '../models/user';
import useUserStore from './useUserStore';

const BASE_URL = 'http://0.0.0.0:8080/api';

type AuthState = {
	accessToken?: string;
	error?: string;
};

type AuthActions = {
	loginFn: (email: string, password: string) => Promise<void>;
	registerFn: (username: string, email: string, password: string) => Promise<UserModel>;
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
	error: undefined,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => {
	return {
		...initialState,
		loginFn: async (email, password) => {
			const formData = new FormData();
			formData.append('username', email);
			formData.append('password', password);

			const response = await fetch(`${BASE_URL}/auth/token`, {
				method: 'POST',
				body: formData,
			}).then((res) => res.json());

			if (response) {
				localStorage.setItem('access_token', response.access_token);
			}
		},
		registerFn: async (username, email, password) => {
			try {
				const response = await fetch(`${BASE_URL}/auth/register`, {
					method: 'POST',
					headers: {
						'Content-type': 'application/json; charset=UTF-8',
					},
					body: JSON.stringify({ username, email, password }),
				});

				if (!response.ok) {
					const errorData = await response.json();
					throw new Error(errorData.message || 'Registration failed');
				}

				const user: UserModel = await response.json();
				useUserStore.getState().setUser(user);
				useAuthStore.getState().loginFn(email, password);
				return user;
			} catch (error) {
				console.error('Registration error:', error);
				throw error;
			}
		},
		logoutFn: () => {
			useUserStore.getState().clearUser();
		},
		loginWithGoogle: () => {
			window.location.href = `${BASE_URL}/auth/google`;
		},
		loginWithSpotify: () => {
			window.location.href = `${BASE_URL}/auth/spotify`;
		},
		loginWithGitHub: () => {
			window.location.href = `${BASE_URL}/auth/github`;
		},
		authorizeGoogleService: (service: string) => {
			const userToken = localStorage.getItem('access_token');
			window.location.href = `${BASE_URL}/services/google/${service}?token=${userToken}`
		},
		authorizeSpotifyService: () => {
			const userToken = localStorage.getItem('access_token');
			window.location.href = `${BASE_URL}/services/spotify?token=${userToken}`
		},
		authorizeDiscordService: () => {
			const userToken = localStorage.getItem('access_token');
			window.location.href = `${BASE_URL}/services/discord?token=${userToken}`
		},
	};
});
