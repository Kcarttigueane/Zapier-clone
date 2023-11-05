import { createBrowserRouter } from 'react-router-dom';
import About from '../../features/about/pages/About';
import ForgotPassword from '../../features/auth/pages/ForgotPassword';
import Login from '../../features/auth/pages/Login';
import Register from '../../features/auth/pages/Register';
import ResetPassword from '../../features/auth/pages/ResetPassword';
import Dashboard from '../../features/dashboard/pages/Dashboard';
import Home from '../../features/home/pages/Home';
import Landing from '../../features/landing/pages/Landing';
import Settings from '../../features/settings/pages/Settings';
import Error404 from '../pages/Error404';
import LoadingPage from '../pages/LoadingPage';
import GuestRoute from './GuestRoutes';
import ProtectedRoute from './ProtectedRoutes';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<GuestRoute>
				<Landing />
			</GuestRoute>
		),
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/about-json',
		element: (
			<ProtectedRoute>
				<About />
			</ProtectedRoute>
		),
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/home',
		element: (
			<ProtectedRoute>
				<Home />
			</ProtectedRoute>
		),
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
		element: (
			<GuestRoute>
				<Login />
			</GuestRoute>
		),
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/auth/login/forgot-password',
		element: (
			<GuestRoute>
				<ForgotPassword />
			</GuestRoute>
		),
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/auth/login/reset-password',
		element: (
			<GuestRoute>
				<ResetPassword />
			</GuestRoute>
		),
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '/auth/register',
		element: (
			<GuestRoute>
				<Register />
			</GuestRoute>
		),
		errorElement: <Error404 />,
		loader: LoadingPage,
	},
	{
		path: '*',
		element: <Error404 />,
	},
]);

export default router;
