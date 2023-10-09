import { create } from 'zustand';
import { UserModel } from '../models/user';
import useUserStore from './useUserStore';

const BASE_URL = 'http://0.0.0.0:8080/api';

type AuthState = {
	isAuthenticated: boolean;
	accessToken?: string;
	error?: string;
};

type AuthActions = {
	setIsAuthenticated: (isAuthenticated: boolean) => void;
	loginFn: (email: string, password: string) => Promise<void>;
	registerFn: (username: string, email: string, password: string) => Promise<UserModel>;
	logoutFn: () => void;
	loginWithGoogle: () => void;
	loginWithSpotify: () => void;
	loginWithGitHub: () => void;
};

const initialState: AuthState = {
	isAuthenticated: false,
	accessToken: undefined,
	error: undefined,
};

export const useAuthStore = create<AuthState & AuthActions>()((set) => {
	return {
		...initialState,
		setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
		loginFn: async (email, password) => {
			const formData = new FormData();
			formData.append('username', email);
			formData.append('password', password);

			const response = await fetch(`${BASE_URL}/auth/token`, {
				method: 'POST',
				body: formData,
			}).then((res) => res.json());

			if (response) {
				set({ isAuthenticated: true });
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
		loginWithGoogle: () => {
			window.location.href = `${BASE_URL}/auth/google`;
		},
		loginWithSpotify: () => {
			window.location.href = `${BASE_URL}/auth/spotify`;
		},
		loginWithGitHub: () => {
			window.location.href = `${BASE_URL}/auth/github`;
		},
	};
});
