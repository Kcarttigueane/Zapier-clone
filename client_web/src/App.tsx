import { ConfigProvider, theme } from 'antd';
import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './core/routes/router';
import './i18n/i18next';

const App = () => {
	const { defaultAlgorithm, darkAlgorithm } = theme;
	const [isDarkMode, setIsDarkMode] = useState(false);

	return (
		<ConfigProvider
			theme={{
				algorithm: isDarkMode ? darkAlgorithm : defaultAlgorithm,
			}}
		>
			<RouterProvider router={router} />
		</ConfigProvider>
	);
};
export default App;
