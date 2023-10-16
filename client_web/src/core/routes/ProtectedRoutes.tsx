import React, { FC, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../store/useUserStore';

type Props = {
	children: React.ReactNode;
};

const ProtectedRoute: FC<Props> = ({ children }) => {
	const isAuthenticated = localStorage.getItem('access_token') !== null;
	const { fetchCurrentUser } = useUserStore((state) => state);
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get('token');

		if (token) {
			localStorage.setItem('access_token', token);
			fetchCurrentUser(token);
			navigate('/home');
		}
	}, [location, navigate]);

	if (!isAuthenticated) {
		return <Navigate to="/auth/login" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
