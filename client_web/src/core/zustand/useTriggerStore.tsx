import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { apiV2, getApiHeaders } from '../api';
import { ServiceModelDTO } from '../models/service';
import { TriggerModelDTO } from '../models/trigger';

type TriggerState = {
	triggers: TriggerModelDTO[];
	triggersAssociatedToService: TriggerModelDTO[];
	isLoading: boolean;
};

type TriggerActions = {
	clearTriggers: () => void;
	fetchTriggers: () => Promise<void>;
	fetchTriggersByService: (serviceId: ServiceModelDTO['id']) => Promise<void>;
};

const initialState: TriggerState = {
	triggers: [],
	triggersAssociatedToService: [],
	isLoading: false,
};

const useTriggerStore = create<TriggerState & TriggerActions>()((set) => ({
	...initialState,
	fetchTriggers: async () => {
		set({ isLoading: true });
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}
		try {
			const response = await apiV2.get('/triggers/', { headers: getApiHeaders(accessToken) });

			if (response.status === HttpStatusCode.Ok && response.data) {
				console.info(response.data);
				set({ triggers: response.data, isLoading: false });
			}
		} catch (error: any) {
			console.error('Error fetching current trigger:', error);
			throw error;
		} finally {
			set({ isLoading: false });
		}
	},
	fetchTriggersByService: async (serviceId: ServiceModelDTO['id']) => {
		set({ isLoading: true });
		try {
			const accessToken = localStorage.getItem('access_token');
			console.log('accessToken', accessToken);
			if (!accessToken) {
				throw new Error('No access token found');
			}
			const response = await apiV2.get(`/triggers/service/${serviceId}`, { headers: getApiHeaders(accessToken) });

			if (response.status === HttpStatusCode.Ok && response.data) {
				console.info(response.data);
				set({ triggersAssociatedToService: response.data, isLoading: false });
			}
		} catch (error: any) {
			console.error('Error fetching current trigger:', error);
			throw error;
		} finally {
			set({ isLoading: false });
		}
	},
	clearTriggers: () => set(() => ({ triggers: [], triggersAssociatedToService: [] })),
}));

export default useTriggerStore;
