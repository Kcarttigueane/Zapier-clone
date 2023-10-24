import React, { FC, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../zustand/useUserStore';

type Props = {
	children: React.ReactNode;
};

const ProtectedRoute: FC<Props> = ({ children }) => {
	const [isTokenChecked, setIsTokenChecked] = useState(false);
	const accessToken = localStorage.getItem('access_token');
	const location = useLocation();
	const navigate = useNavigate();
	const { fetchCurrentUser } = useUserStore((state) => state);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const token = params.get('token');

		if (token) {
			try {
				fetchCurrentUser(token);
				localStorage.setItem('access_token', token);
				navigate('/home');
			} catch (error) {
				console.error('Error fetching current user:', error);
			}
		} else if (!accessToken) {
			navigate('/auth/login');
		}

		setIsTokenChecked(true);
	}, [location, accessToken]);

	if (!isTokenChecked) {
		return null;
	}

	if (!accessToken) {
		return <Navigate to="/auth/login" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
