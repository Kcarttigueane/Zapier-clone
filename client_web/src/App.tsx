import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ConfigProvider, theme } from 'antd';
import { CookiesProvider } from 'react-cookie';
import { RouterProvider } from 'react-router-dom';
import router from './core/routes/router';
import './i18n/i18next';

const queryClient = new QueryClient();

const App = () => {
	const { defaultAlgorithm, darkAlgorithm } = theme;
	// const [isDarkMode, setIsDarkMode] = useState(false);
	const isDarkMode = false;

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={true} />
			<CookiesProvider>
				<ConfigProvider
					theme={{
						algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
					}}
				>
					<RouterProvider router={router} />
				</ConfigProvider>
			</CookiesProvider>
		</QueryClientProvider>
	);
};
export default App;
