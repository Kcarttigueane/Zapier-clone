import { create } from 'zustand';
import { UserModel } from '../models/user';
import useUserStore from './useUserStore';

const BASE_URL = 'http:///127.0.0.1:8000/api';

type AuthState = {
	isAuthenticated: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (username: string, email: string, password: string) => Promise<void>;
	logout: () => void;
};

type LoginResponse = {
	access_token: string;
	token_type: string;
};

export const useAuthStore = create<AuthState>()((set) => ({
	isAuthenticated: false,
	login: async (email, password) => {
		const userToken: LoginResponse = await fetch(`${BASE_URL}/auth/token`, {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		}).then((res) => res.json());

		console.log('user', userToken);

		if (userToken) {
			useUserStore.getState().fetchCurrentUser(userToken.access_token);
		}
	},
	register: async (username, email, password) => {
		const user: UserModel = await fetch(`${BASE_URL}/auth/register`, {
			method: 'POST',
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
			body: JSON.stringify({ username, email, password }),
		}).then((res) => res.json());

		if (user) {
			set({ isAuthenticated: true });
			useUserStore.getState().setUser(user);
		}
	},
	logout: () => {
		set({ isAuthenticated: false });
		useUserStore.getState().clearUser();
	},
}));
