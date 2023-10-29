import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { apiV2, getApiHeaders } from '../api';
import { AutomationCreationDTO, AutomationDTO, DetailedAutomationDTO } from '../models/automation';

type AutomationState = {
	automations: AutomationDTO[];
	automationWithDetails: DetailedAutomationDTO[];
	isAutomationsLoading: boolean;
};

type AutomationActions = {
	clearAutomations: () => void;
	fetchAutomations: () => Promise<void>;
	fetchDetailedAutomations: () => Promise<DetailedAutomationDTO[]>;
	deleteAutomation: (automationId: AutomationDTO['id']) => Promise<void>;
	createAutomation: (automationData: AutomationCreationDTO) => Promise<void>;
	updateAutomation: (automationId: AutomationDTO['id'], automationData: AutomationCreationDTO) => Promise<void>;
};

const initialState: AutomationState = {
	automations: [],
	automationWithDetails: [],
	isAutomationsLoading: false,
};

const useAutomationStore = create<AutomationState & AutomationActions>()((set) => ({
	...initialState,
	fetchAutomations: async () => {
		set({ isAutomationsLoading: true });
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}

		try {
			const response = await apiV2.get('/automations', { headers: getApiHeaders(accessToken) });

			if (response.status === HttpStatusCode.Ok && response.data) {
				console.info(response.data);
				set({ automations: response.data, isAutomationsLoading: false });
			}
		} catch (error: any) {
			console.error('Error fetching automations:', error);
			throw error;
		} finally {
			set({ isAutomationsLoading: false });
		}
	},
	fetchDetailedAutomations: async () => {
		set({ isAutomationsLoading: true });
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}

		try {
			const response = await apiV2.get('/automations/detailed', { headers: getApiHeaders(accessToken) });

			if (response.status === HttpStatusCode.Ok && response.data) {
				console.info(response.data);
				set({ automationWithDetails: response.data, isAutomationsLoading: false });
				return response.data;
			}
		} catch (error: any) {
			console.error('Error fetching automations:', error);
			throw error;
		} finally {
			set({ isAutomationsLoading: false });
		}
	},
	createAutomation: async (automationData: AutomationCreationDTO) => {
		set({ isAutomationsLoading: true });
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}
		try {
			const response = await apiV2.post('/automations', automationData, { headers: getApiHeaders(accessToken) });

			if (response.status === HttpStatusCode.Created && response.data) {
				console.info(response.data);
				set((state) => ({ automations: [...state.automations, response.data], isAutomationsLoading: false }));
			}
		} catch (error: any) {
			console.error('Error creating automation:', error);
			throw error;
		} finally {
			set({ isAutomationsLoading: false });
		}
	},
	deleteAutomation: async (automationId: AutomationDTO['id']) => {
		set({ isAutomationsLoading: true });
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}
		try {
			const response = await apiV2.delete(`/automations/${automationId}`, { headers: getApiHeaders(accessToken) });

			if (response.status === HttpStatusCode.NoContent) {
				console.info(response.data);
				set((state) => ({
					automations: state.automations.filter((automation) => automation.id !== automationId),
					isAutomationsLoading: false,
				}));
			}
		} catch (error: any) {
			console.error('Error deleting automation:', error);
			throw error;
		} finally {
			set({ isAutomationsLoading: false });
		}
	},
	clearAutomations: () => set(() => ({ automations: [] })),
	updateAutomation: async (automationId: AutomationDTO['id'], automationData: AutomationCreationDTO) => {
		set({ isAutomationsLoading: true });
		const accessToken = localStorage.getItem('access_token');
		if (!accessToken) {
			throw new Error('No access token found');
		}
		try {
			const response = await apiV2.patch(`/automations/${automationId}`, automationData, {
				headers: getApiHeaders(accessToken),
			});

			if (response.status === HttpStatusCode.Ok && response.data) {
				console.info(response.data);
				set((state) => ({
					automations: state.automations.map((automation) => {
						if (automation.id === automationId) {
							return response.data;
						}
						return automation;
					}),
					isAutomationsLoading: false,
				}));
			}
		} catch (error: any) {
			console.error('Error updating automation:', error);
			throw error;
		} finally {
			set({ isAutomationsLoading: false });
		}
	},
}));

export default useAutomationStore;
