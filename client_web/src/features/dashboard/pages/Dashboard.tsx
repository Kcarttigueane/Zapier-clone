import { Layout } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import React from 'react';
import CustomNavBar from '../../../core/components/CustomNavBar';
import AutomationTable from '../components/AutomationTable';

const layoutStyle: React.CSSProperties = {
	minHeight: '100vh',
	backgroundColor: '#fff',
};

const contentStyle: React.CSSProperties = {
	padding: '48px 24px',
	color: '#000',
	display: 'flex',
	flexDirection: 'column',
	gap: '50px',
	alignItems: 'center',
};

const MainZapStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	padding: '32px',
	width: '100%',
	borderRadius: '25px',
	boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25), 0 -2px 4px rgba(0, 0, 0, 0.25)',
	backgroundColor: '#FFFEFC',
	gap: '16px',
};

const footerStyle: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.1)',
	background: '#fff',
};

const Dashboard = () => {
	return (
		<Layout style={layoutStyle}>
			<CustomNavBar />
			<Content style={contentStyle}>
				<Layout style={MainZapStyle}>
					<AutomationTable />
				</Layout>
			</Content>
			<Footer style={footerStyle}>Area ©2023 Created by AREA EPITECH</Footer>
		</Layout>
	);
};

export default Dashboard;
