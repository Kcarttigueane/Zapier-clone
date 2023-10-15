import { create } from 'zustand';

const BASE_URL = 'http://127.0.0.1:8080/api/automations';

type AutomationState = {
  isAutomationCreated: boolean;
  error?: string;
};

type AutomationActions = {
  isAutomationCreated: boolean;
  setIsAutomationCreated: (isCreated: boolean) => void;
  createAutomation: () => Promise<void>;
  updateAutomation: (automation: any) => Promise<void>;
  deleteAutomation: (automation: any) => Promise<void>;
};

const initialState: AutomationState = {
  isAutomationCreated: false,
  error: undefined,
};

export const useAutomationStore = create<AutomationState & AutomationActions>()((set) => ({
  ...initialState,
  setIsAutomationCreated: (isCreated) => set({ isAutomationCreated: isCreated }),
  createAutomation: async () => {
    try {
      const userToken = localStorage.getItem('access_token');
      if (!userToken) {
        throw new Error('No user token found');
      }

      const response = await fetch(`${BASE_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          action: 'youtube_new_like',
          reaction: 'spotify_add_song',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Automation creation failed');
      }

      set({ isAutomationCreated: true });
    } catch (error: any) {
      const errorMessage = error.message;
      console.error('Automation creation error:', errorMessage);
      set({ error: errorMessage });
    }
  },
  updateAutomation: async (automation: any) => {
    try {
      const userToken = localStorage.getItem('access_token');
      if (!userToken) {
        throw new Error('No user token found');
      }
      const automationId = automation['_id'];
      const response = await fetch(`${BASE_URL}/${automationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(automation)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Automation update failed');
      }

    } catch (error: any) {
      const errorMessage = error.message;
      console.error('Automation creation error:', errorMessage);
      set({ error: errorMessage });
    }
  },
  deleteAutomation: async (automation: any) => {
    try {
      const userToken = localStorage.getItem('access_token');
      if (!userToken) {
        throw new Error('No user token found');
      }
      const automationId = automation['_id'];
      const response = await fetch(`${BASE_URL}/${automationId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Automation delete failed');
      }

    } catch (error: any) {
      const errorMessage = error.message;
      console.error('Automation creation error:', errorMessage);
      set({ error: errorMessage });
    }
  },
}));
