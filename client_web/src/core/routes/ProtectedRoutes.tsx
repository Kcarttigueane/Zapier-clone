import React, { FC, useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../zustand/useUserStore';

type Props = {
	children: React.ReactNode;
};

const ProtectedRoute: FC<Props> = ({ children }) => {
	const [isTokenChecked, setIsTokenChecked] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { fetchCurrentUser } = useUserStore((state) => state);

	useEffect(() => {
		const fetchUser = async () => {
			const params = new URLSearchParams(location.search);
			const tokenFromURL = params.get('token');
			const tokenFromLocalStorage = localStorage.getItem('access_token');

			const token = tokenFromURL || tokenFromLocalStorage;

			if (token) {
				try {
					await fetchCurrentUser(token);
					if (tokenFromURL) {
						localStorage.setItem('access_token', token);
						navigate('/home');
					}
				} catch (error) {
					console.error('Error fetching current user:', error);
				}
			} else {
				navigate('/auth/login');
			}

			setIsTokenChecked(true);
		};

		fetchUser();
	}, [location, navigate, fetchCurrentUser]);

	if (!isTokenChecked) {
		return null;
	}

	const accessToken = localStorage.getItem('access_token');
	if (!accessToken) {
		return <Navigate to="/auth/login" />;
	}

	return <>{children}</>;
};

export default ProtectedRoute;
