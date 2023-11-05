import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { apiV2, getApiHeaders } from '../api';
import { UserModelDTO } from '../models/user';

type UserState = {
	user: UserModelDTO | null;
	isLoading: boolean;
};

type UserActions = {
	setUser: (user: UserModelDTO) => void;
	clearUser: () => void;
	fetchCurrentUser: (accessToken: string) => Promise<any | undefined>;
	updateUser: (user: Partial<UserModelDTO>) => Promise<void>;
	deleteUser: () => Promise<void>;
};

const useUserStore = create<UserState & UserActions>()((set) => ({
	user: null,
	isLoading: false,
	error: undefined,
	setUser: (user) => set(() => ({ user })),
	clearUser: () => set(() => ({ user: null })),
	fetchCurrentUser: async (accessToken: string) => {
		set({ isLoading: true });
		try {
			const response = await apiV2.get('/users/me', { headers: getApiHeaders(accessToken) });

			if (response.status === HttpStatusCode.Ok && response.data) {
				set({ user: response.data, isLoading: false });
			}
		} catch (error: any) {
			throw error;
		} finally {
			set({ isLoading: false });
		}
	},
	updateUser: async (user) => {
		set({ isLoading: true });
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}

		try {
			const userId = useUserStore.getState().user?.id;

			const response = await apiV2.patch(`/users/${userId}`, user, {
				headers: getApiHeaders(accessToken),
			});

			if (response.status === HttpStatusCode.Ok && response.data) {
				set({ user: response.data, isLoading: false });
			}
		} catch (error: any) {
			throw error;
		} finally {
			set({ isLoading: false });
		}
	},
	deleteUser: async () => {
		set({ isLoading: true });
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}

		try {
			const userId = useUserStore.getState().user?.id;
			const response = await apiV2.delete(`/users/${userId}`, {
				headers: getApiHeaders(accessToken),
			});
			if (response.status === HttpStatusCode.Ok && response.data) {
				set({ user: null, isLoading: false });
			}
		} catch (error: any) {
			throw error;
		} finally {
			set({ isLoading: false });
		}
	},
}));

export default useUserStore;
