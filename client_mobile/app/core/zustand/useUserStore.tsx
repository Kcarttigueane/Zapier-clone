import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { apiV2, getAccessToken, getApiHeaders } from '../api';
import { UserModelDTO } from '../models/user';

type UserState = {
  user: UserModelDTO | null;
  isUserLoading: boolean;
  error?: string;
};

type UserActions = {
  setUser: (user: UserModelDTO) => void;
  clearUser: () => void;
  fetchCurrentUser: (accessToken: string) => Promise<any | undefined>;
  updateUser: (user: Partial<UserModelDTO>) => Promise<void>;
  deleteUser: () => Promise<void>;
};

const useUserStore = create<UserState & UserActions>()(set => ({
  user: null,
  isUserLoading: false,
  error: undefined,
  setUser: user => set(() => ({ user })),
  clearUser: () => set(() => ({ user: null })),
  fetchCurrentUser: async accessToken => {
    set({ isUserLoading: true, error: undefined });
    try {
      const response = await apiV2.get('/users/me', { headers: getApiHeaders(accessToken) });

      if (response.status === HttpStatusCode.Ok && response.data) {
        set({ user: response.data, isUserLoading: false });
      }
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      set({ error: error.message });
    } finally {
      set({ isUserLoading: false });
    }
  },
  updateUser: async user => {
    set({ isUserLoading: true, error: undefined });
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('No access token found');
    }

    try {
      const userId = useUserStore.getState().user?.id;

      const response = await apiV2.patch(`/users/${userId}`, user, {
        headers: getApiHeaders(accessToken),
      });

      set({ user: response.data });
    } catch (error: any) {
      console.error('Error updating user:', error);
      set({ error: error.message });
    } finally {
      set({ isUserLoading: false });
    }
  },
  deleteUser: async () => {
    set({ isUserLoading: true, error: undefined });
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('No access token found');
    }

    try {
      const userId = useUserStore.getState().user?.id;
      const response = await apiV2.delete(`/users/${userId}`, {
        headers: getApiHeaders(accessToken),
      });
      if (response.status === HttpStatusCode.Ok && response.data) {
        set({ user: null });
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      set({ error: error.message });
    } finally {
      set({ isUserLoading: false });
    }
  },
}));

export default useUserStore;
