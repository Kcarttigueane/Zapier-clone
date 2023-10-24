import { HttpStatusCode } from 'axios';
import { create } from 'zustand';
import { apiV2 } from '../api';
import { ActionModelDTO } from '../models/action';

type ActionState = {
	actions: ActionModelDTO[];
	isLoading: boolean;
};

type ActionActions = {
	clearActions: () => void;
	fetchActions: () => Promise<any | undefined>;
};

const initialState: ActionState = {
	actions: [],
	isLoading: false,
};

const useActionStore = create<ActionState & ActionActions>()((set) => ({
	...initialState,
	fetchActions: async () => {
		set({ isLoading: true });
		try {
			const response = await apiV2.get('/actions/');

			if (response.status === HttpStatusCode.Ok && response.data) {
				console.log(response.data);
				set({ actions: response.data, isLoading: false });
			}
		} catch (error: any) {
			console.error('Error fetching current action:', error);
			throw error;
		} finally {
			set({ isLoading: false });
		}
	},
	clearActions: () => set(() => ({ actions: [] })),
}));

export default useActionStore;
