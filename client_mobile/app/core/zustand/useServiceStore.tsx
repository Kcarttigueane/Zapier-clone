import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { apiV2, getApiHeaders } from '../api';
import { ServiceModeWithAuthorizationDTO, ServiceModelDTO } from '../models/service';
import { useAuthStore } from './useAuthStore';

type ServicesState = {
  services: ServiceModelDTO[];
  compatibleServices: ServiceModelDTO[];
  userAuthorizedServices: ServiceModeWithAuthorizationDTO[];
  isLoading: boolean;
};

type ServiceActions = {
  clearServices: () => void;
  fetchServices: () => Promise<ServiceModelDTO[]>;
  fetchCompatibleServices: (serviceId: ServiceModelDTO['id']) => Promise<void>;
  fetchUserAuthorizedServices: () => Promise<void>;
};

const initialState: ServicesState = {
  services: [],
  compatibleServices: [],
  userAuthorizedServices: [],
  isLoading: false,
};

const useServicesStore = create<ServicesState & ServiceActions>()(set => ({
  ...initialState,
  fetchServices: async () => {
    set({ isLoading: true });
    try {
      const response = await apiV2.get('/services');

      if (response.status === HttpStatusCode.Ok && response.data) {
        set({ services: response.data, isLoading: false });
        return response.data;
      }
    } catch (error: any) {
      console.error('Error fetching current services:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchCompatibleServices: async (serviceId: ServiceModelDTO['id']) => {
    set({ isLoading: true });
    try {
      const response = await apiV2.get(`/services/${serviceId}/compatibilities`);

      if (response.status === HttpStatusCode.Ok && response.data) {
        set({ compatibleServices: response.data, isLoading: false });
      }
    } catch (error: any) {
      console.error('Error fetching current services:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  fetchUserAuthorizedServices: async () => {
    set({ isLoading: true });
    const accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      throw new Error('No access token found');
    }

    try {
      const response = await apiV2.get('/services/authorized', { headers: getApiHeaders(accessToken) });

      if (response.status === HttpStatusCode.Ok && response.data) {
        set({ userAuthorizedServices: response.data, isLoading: false });
      }
    } catch (error: any) {
      console.error('Error fetching current services:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  clearServices: () => set(() => ({ services: [] })),
}));

export default useServicesStore;
