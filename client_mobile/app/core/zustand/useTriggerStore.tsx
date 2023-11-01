import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { apiV2, getAccessToken, getApiHeaders } from '../api';
import { ServiceModelDTO } from '../models/service';
import { TriggerModelDTO } from '../models/trigger';

type TriggerState = {
  triggers: TriggerModelDTO[];
  triggersAssociatedToService: TriggerModelDTO[];
  isTriggersLoading: boolean;
};

type TriggerActions = {
  clearTriggers: () => void;
  fetchTriggers: () => Promise<void>;
  fetchTriggersByService: (serviceId: ServiceModelDTO['id']) => Promise<void>;
};

const initialState: TriggerState = {
  triggers: [],
  triggersAssociatedToService: [],
  isTriggersLoading: false,
};

const useTriggerStore = create<TriggerState & TriggerActions>()(set => ({
  ...initialState,
  fetchTriggers: async () => {
    set({ isTriggersLoading: true });
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('No access token found');
    }

    try {
      const response = await apiV2.get('/triggers/', { headers: getApiHeaders(accessToken) });

      if (response.status === HttpStatusCode.Ok && response.data) {
        set({ triggers: response.data, isTriggersLoading: false });
      }
    } catch (error: any) {
      console.error('Error fetching current trigger:', error);
      throw error;
    } finally {
      set({ isTriggersLoading: false });
    }
  },
  fetchTriggersByService: async (serviceId: ServiceModelDTO['id']) => {
    set({ isTriggersLoading: true });
    const accessToken = await getAccessToken();
    if (!accessToken) {
      throw new Error('No access token found');
    }
    try {
      const response = await apiV2.get(`/triggers/service/${serviceId}`, { headers: getApiHeaders(accessToken) });

      if (response.status === HttpStatusCode.Ok && response.data) {
        set({ triggersAssociatedToService: response.data, isTriggersLoading: false });
      }
    } catch (error: any) {
      console.error('Error fetching current trigger:', error);
      throw error;
    } finally {
      set({ isTriggersLoading: false });
    }
  },
  clearTriggers: () => set(() => ({ triggers: [], triggersAssociatedToService: [] })),
}));

export default useTriggerStore;
