import { Layout, theme } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import React, { useEffect } from 'react';
import CustomNavBar from '../../../core/components/CustomNavBar';
import useServicesStore from '../../../core/zustand/useServiceStore';
import RecommendServices from '../components/RecommendServices';
import AutomationCreation from '../components/automationCreation/AutomationCreation';

const Home = () => {
	const { fetchServices } = useServicesStore((state) => state);
	const { token } = theme.useToken();

	const layoutStyle: React.CSSProperties = {
		minHeight: '100vh',
		backgroundColor: token.colorPrimaryBg,
	};

	const contentStyle: React.CSSProperties = {
		padding: '48px 24px',
		display: 'flex',
		flexDirection: 'column',
		gap: '24px',
		alignItems: 'center',
	};

	const MainZapStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		padding: '32px',
		width: '90%',
		borderRadius: '25px',
		boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25), 0 -2px 4px rgba(0, 0, 0, 0.25)',
		backgroundColor: token.colorBgElevated,
		gap: '36px',
	};

	const footerStyle: React.CSSProperties = {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.1)',
		backgroundColor: token.colorBgElevated,
	};

	useEffect(() => {
		fetchServices();
	}, []);

	return (
		<Layout style={layoutStyle}>
			<CustomNavBar />
			<Content style={contentStyle}>
				<Layout style={MainZapStyle}>
					<AutomationCreation />
				</Layout>
				<RecommendServices />
			</Content>
			<Footer style={footerStyle}>Area ©2023 Created by AREA EPITECH</Footer>
		</Layout>
	);
};

export default Home;
