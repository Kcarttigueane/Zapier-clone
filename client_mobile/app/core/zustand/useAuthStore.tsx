import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { apiV2 } from '../api';
import { Linking } from 'react-native';

type AuthState = {
  accessToken?: string;
  isLoading: boolean;
  error: null | string;
};

type AuthActions = {
  loginFn: (email: string, password: string) => Promise<void>;
  registerFn: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logoutFn: () => void;
  loginWithGoogle: () => void;
  loginWithSpotify: () => void;
  loginWithGitHub: () => void;
};

const initialState: AuthState = {
  accessToken: undefined,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(set => {
  return {
    ...initialState,
    loginFn: async (email, password) => {
      let response = null;
      set({ isLoading: true, error: null });
      try {
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        response = await apiV2.post('/auth/token', formData, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        if (response.status === HttpStatusCode.Ok && response.data) {
          const { accessToken } = response.data;
          set({ accessToken: accessToken });
          set({ isLoading: false });
        }
      } catch (error: any) {
        throw error;
      } finally {
        if (response === null) {
          set({ error: 'Error logging in' });
        }
        set({ isLoading: false });
      }
    },
    registerFn: async (firstName: any, lastName: any, email: any, password: any) => {
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
        if (response.status === 201 && response.data) {
          const { accessToken } = response.data;
          set({ accessToken: accessToken });
          console.log('User registered successfully');
        } else {
          set({ error: response.data?.message || 'Login failed', isLoading: false });
        }
      } catch (error: any) {
        console.error('Error registering user:', error);
        const errorMessage = error.response?.data?.message || 'An error occurred during login';
        set({ error: errorMessage, isLoading: false });
        throw error;
      } finally {
        set({ isLoading: false });
      }
    },
    logoutFn: () => {
      set({ accessToken: undefined, isLoading: false, error: null });
    },
    loginWithGoogle: async () => {
      Linking.openURL('http://0.0.0.0:8080/api/v2/auth/login/mobile/google');
      set({ accessToken: 'token' });
    },
    loginWithSpotify: () => {
      Linking.openURL('http://0.0.0.0:8080/api/v2/auth/login/mobile/spotify');
      set({ accessToken: 'token' });
    },
    loginWithGitHub: () => {
      Linking.openURL('http://0.0.0.0:8080/api/v2/auth/login/mobile/github');
      set({ accessToken: 'token' });
    },
  };
});
