import { create } from 'zustand';
import { UserModel } from '../models/user';
import useUserStore from './useUserStore';

const BASE_URL = 'http://127.0.0.1:8080/api';

type AuthState = {
	isAuthenticated: boolean;
};

type AuthActions = {
	isAuthenticated: boolean;
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	loginFn: (email: string, password: string) => Promise<void>;
	registerFn: (username: string, email: string, password: string) => Promise<UserModel>;
	logoutFn: () => void;
	loginWithGoogle: () => Promise<void>;
	loginWithSpotify: () => Promise<void>;
	loginWithGitHub: () => Promise<void>;
};

type LoginResponse = {
	access_token: string;
	token_type: string;
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => {
	return {
		isAuthenticated: false,
		setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
		loginFn: async (email, password) => {
			const userToken: LoginResponse = await fetch(`${BASE_URL}/auth/token`, {
				method: 'POST',
				body: JSON.stringify({ email, password }),
			}).then((res) => res.json());
			if (userToken) {
				useUserStore.getState().fetchCurrentUser(userToken.access_token);
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
				set({ isAuthenticated: true });
				return user;
			} catch (error) {
				console.error('Registration error:', error);
				throw error;
			}
		},

		logoutFn: () => {
			set({ isAuthenticated: false });
			useUserStore.getState().clearUser();
		},
		loginWithGoogle: async () => {
			window.location.href = `${BASE_URL}/auth/google`;
		},
		loginWithSpotify: async () => {
			window.location.href = `${BASE_URL}/auth/spotify`;
		},
		loginWithGitHub: async () => {
			window.location.href = `${BASE_URL}/auth/github`;
		},
	};
});
