import { create } from 'zustand';
import { UserModel } from '../models/user';

const BASE_URL = 'http://127.0.0.1:8000/api';

type UserState = {
	user: UserModel | null;
};

type UserActions = {
	setUser: (user: UserModel) => void;
	clearUser: () => void;
	fetchCurrentUser: (accessToken: string) => Promise<void>;
	updateUser: (userId: number, user: Partial<UserModel>) => Promise<void>;
	deleteUser: (userId: number) => Promise<void>;
};

const useUserStore = create<UserState & UserActions>()((set) => ({
	user: null,
	setUser: (user) => set(() => ({ user })),
	clearUser: () => set(() => ({ user: null })),
	fetchCurrentUser: async (accessToken: string) => {
		try {
			const response = await fetch(`${BASE_URL}/users/me`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			}).then((res) => res.json());

			const user: UserModel = response;

			set({ user });
		} catch (error) {
			console.error('Error fetching current user:', error);
		}
	},
	updateUser: async (user) => {
		try {
			const userId = useUserStore.getState().user?.id;

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
			set({ user: updatedUser });
		} catch (error) {
			console.error('Error updating user:', error);
		}
	},
	deleteUser: async () => {
		try {
			const userId = useUserStore.getState().user?.id;
			const response = await fetch(`/users/${userId}`, { method: 'DELETE' });

			if (!response.ok) {
				throw new Error('Failed to delete user');
			}

			set({ user: null });
		} catch (error) {
			console.error('Error deleting user:', error);
		}
	},
}));

export default useUserStore;
