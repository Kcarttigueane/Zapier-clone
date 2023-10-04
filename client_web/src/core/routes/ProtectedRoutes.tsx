import React, { FC, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

type Props = {
	children: React.ReactNode;
};

const ProtectedRoute: FC<Props> = ({ children }) => {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get('token');

		if (token) {
			localStorage.setItem('access_token', token);
			useAuthStore.setState({ isAuthenticated: true });
			navigate('/dashboard');
		}
	}, [location, navigate]);

	if (!isAuthenticated) {
		return <Navigate to="/auth/login" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
