import { createBrowserRouter } from 'react-router-dom';
import Login from '../../features/auth/pages/Login';
import Register from '../../features/auth/pages/Register';
import Dashboard from '../../features/dashboard/pages/Dashboard';
import DashboardAutomations from '../../features/dashboard2.0/pages/Dashboard';
import Landing from '../../features/landing/pages/Landing';
import Settings from '../../features/settings/pages/Settings';
import Error404 from '../pages/Error404';
import LoadingPage from '../pages/LoadingPage';
import ProtectedRoute from './ProtectedRoutes';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Landing />,
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/dashboard',
		element: (
			<ProtectedRoute>
				<Dashboard />
			</ProtectedRoute>
		),
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/dashboard2.0',
		element: (
			<ProtectedRoute>
				<DashboardAutomations />
			</ProtectedRoute>
		),
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/settings',
		element: (
			<ProtectedRoute>
				<Settings />
			</ProtectedRoute>
		),
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/auth/login',
		element: <Login />,
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/auth/register',
		element: <Register />,
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '*',
		element: <Error404 />,
	},
]);

export default router;
