import AsyncStorage from '@react-native-async-storage/async-storage';
import { HttpStatusCode } from 'axios';
import { Linking } from 'react-native';
import { create } from 'zustand';
import { BASE_URL, apiV2, getAccessToken, getApiHeaders, setAccessToken } from '../api';
import useUserStore from './useUserStore';

type AuthState = {
  isLoading: boolean;
  isLoggedIn: boolean;
};

type AuthActions = {
  loginFn: (email: string, password: string) => Promise<void>;
  registerFn: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  setLoggedIn: (isLoggedIn: boolean) => void;
  logoutFn: () => void;
  loginWithGoogle: () => void;
  loginWithSpotify: () => void;
  loginWithGitHub: () => void;
  authorizeService: (provider: string, service: string) => Promise<void>;
};

const initialState: AuthState = {
  isLoading: false,
  isLoggedIn: false,
};

export const useAuthStore = create<AuthState & AuthActions>()(set => {
  return {
    ...initialState,
    loginFn: async (email, password) => {
      set({ isLoading: true });
      try {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);

        const response = await apiV2.post('/auth/token', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        if (response.status === HttpStatusCode.Ok && response.data) {
          const { accessToken } = response.data;
          console.log('Access token:', accessToken);
          try {
            set({ isLoading: true });
            await useUserStore.getState().fetchCurrentUser(accessToken);
            set({ isLoggedIn: true });
            await setAccessToken(accessToken);
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

        if (response.status === HttpStatusCode.Created && response.data) {
          const { accessToken } = response.data;

          try {
            set({ isLoading: true });
            await useUserStore.getState().fetchCurrentUser(accessToken);
            set({ isLoggedIn: true });
            await setAccessToken(accessToken);
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
    setLoggedIn: (isLoggedIn: boolean) => {
      set({ isLoggedIn: isLoggedIn });
    },
    logoutFn: () => {
      console.info('Logging out');
      AsyncStorage.removeItem('@access_token');
      useUserStore.getState().clearUser();
      set({ isLoggedIn: false });
    },
    loginWithGoogle: async () => {
      const url = `${BASE_URL}/auth/login/mobile/google`;
      await Linking.openURL(url);

      // try {
      //   const supported = await Linking.canOpenURL(url);
      //   if (supported) {
      //     await Linking.openURL(url);
      //   } else {
      //     console.error('Cannot open URL:', url);
      //   }
      // } catch (error) {
      //   console.error('An error occurred while trying to open URL:', url, error);
      // }
    },
    loginWithSpotify: async () => {
      const url = `${BASE_URL}/auth/login/mobile/spotify`;
      await Linking.openURL(url);
    },
    loginWithGitHub: async () => {
      const url = `${BASE_URL}/auth/login/mobile/github`;
      await Linking.openURL(url);
    },
    authorizeService: async (provider: string, service: string) => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('No access token found');
      }

      try {
        const response = await apiV2.get('/auth/authorize/mobile/' + provider + '/' + service, {
          headers: getApiHeaders(accessToken),
        });
        if (response.status === HttpStatusCode.Ok && response.data) {
          const url = response.data;
          Linking.openURL(url);
        }
      } catch (error: any) {
        console.error('Error authorizing service:', error);
        throw error;
      }
    },
  };
});
