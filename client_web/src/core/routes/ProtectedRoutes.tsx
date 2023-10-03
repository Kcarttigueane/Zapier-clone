import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStoreBase from '../../features/auth/store/authStore';

type Props = {
	children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
	const { isLoggedIn } = useAuthStoreBase((state) => state);

	if (isLoggedIn) {
		return <>{children}</>;
	}

	return <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
