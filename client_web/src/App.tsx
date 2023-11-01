import { ConfigProvider, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import router from './core/routes/router';
import './i18n/i18next';
import useUserStore from './core/zustand/useUserStore';


const App = () => {
	const { defaultAlgorithm, darkAlgorithm } = theme;
	const { user } = useUserStore((state) => state);
	let isDarkMode = false;
	if (user === undefined) {
		isDarkMode = false;
	} else {
		isDarkMode = user?.profile.theme === 'dark' ? true : false;
	}
	console.log('isDarkMode', isDarkMode);

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
