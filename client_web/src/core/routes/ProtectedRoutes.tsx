import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

type Props = {
	children: React.ReactNode;
};

const ProtectedRoute: React.FC<Props> = ({ children }) => {
	const { isAuthenticated } = useAuthStore((state) => state);

	if (isAuthenticated) {
		return <>{children}</>;
	}

	return <Navigate to="/auth/login" replace />;
};

export default ProtectedRoute;
