import { create } from 'zustand';

type AuthState = {
	isLoggedIn: boolean;
	isLoading: boolean;
	error: string | null;
};

type AuthActions = {
	logoutFn: () => void;
};

const initialState: AuthState = {
	isLoggedIn: true,
	isLoading: false,
	error: null,
};

const useAuthStoreBase = create<AuthState & AuthActions>()((set, get) => ({
	...initialState,
	logoutFn: () => {
		set(initialState);
	},
}));

export default useAuthStoreBase;
