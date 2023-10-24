import React, { FC } from 'react';
import { Navigate } from 'react-router-dom';

type Props = {
	children: React.ReactNode;
};

const GuestRoute: FC<Props> = ({ children }) => {
	const accessToken = localStorage.getItem('access_token');

	if (accessToken) {
		return <Navigate to="/home" />;
	}

	return <>{children}</>;
};

export default GuestRoute;
