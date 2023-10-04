import { useEffect } from 'react';
import useUserStore from '../../../core/store/useUserStore';

const Dashboard = () => {
	const { user } = useUserStore((state) => state);

	useEffect(() => {
		console.log(user);
	}, [user]);

	return <div>Dashboard</div>;
};

export default Dashboard;
