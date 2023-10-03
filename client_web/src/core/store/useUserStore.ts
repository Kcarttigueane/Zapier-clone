import { create } from 'zustand';
import { UserModel } from '../models/user';

const BASE_URL = 'http:///127.0.0.1:8000/api';

const initialUserState: UserModel = {
	id: 0,
	email: '',
	passwordHash: '',
	status: 'active',
	emailVerified: false,
	createdAt: new Date(),
	updatedAt: new Date(),
};

type InitialUserActions = {
	setUser: (user: UserModel) => void;
	clearUser: () => void;
	fetchCurrentUser: (accessToken: string) => Promise<void>;
	updateUser: (userId: number, user: Partial<UserModel>) => Promise<void>;
	deleteUser: (userId: number) => Promise<void>;
};

const useUserStore = create<UserModel & InitialUserActions>()((set, _) => ({
	...initialUserState,
	setUser: (user) => set(() => ({ ...user })),
	clearUser: () => set(() => initialUserState),
	fetchCurrentUser: async (accessToken: string) => {
		try {
			const response = await fetch(`${BASE_URL}/users/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch current user');
			}

			const user: UserModel = await response.json();

			set({ ...user });
		} catch (error) {
			console.error('Error fetching current user:', error);
		}
	},
	updateUser: async (user) => {
		try {
			const userId = useUserStore.getState().id;

			const response = await fetch(`/users/${userId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(user),
			});

			if (!response.ok) {
				throw new Error('Failed to update user');
			}

			const updatedUser: UserModel = await response.json();
			set({ ...updatedUser });
		} catch (error) {
			console.error('Error updating user:', error);
		}
	},
	deleteUser: async () => {
		try {
			const userId = useUserStore.getState().id;
			const response = await fetch(`/users/${userId}`, { method: 'DELETE' });

			if (!response.ok) {
				throw new Error('Failed to delete user');
			}

			set(() => initialUserState);
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	},
}));

export default useUserStore;
