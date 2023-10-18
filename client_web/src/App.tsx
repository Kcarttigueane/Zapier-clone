import { ConfigProvider, theme } from 'antd';
import { CookiesProvider } from 'react-cookie';
import { RouterProvider } from 'react-router-dom';
import router from './core/routes/router';
import './i18n/i18next';

const App = () => {
	const { defaultAlgorithm, darkAlgorithm } = theme;
	// const [isDarkMode, setIsDarkMode] = useState(false);
	const isDarkMode = false;

	return (
		<CookiesProvider>
			<ConfigProvider
				theme={{
					algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
				}}
			>
				<RouterProvider router={router} />
			</ConfigProvider>
		</CookiesProvider>
	);
};
export default App;
