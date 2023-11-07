import { Button, Drawer, Layout, Space, theme } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import CustomNavBar from '../../../core/components/CustomNavBar';
import AutomationUsageChart from '../components/AutomationCharts';
import AutomationTable from '../components/AutomationTable';

const contentStyle: React.CSSProperties = {
	padding: '48px 24px',
	color: '#000',
	display: 'flex',
	flexDirection: 'column',
	gap: '50px',
	alignItems: 'center',
};

const Dashboard = () => {
	const { token } = theme.useToken();
	const [openDrawer, setOpenDrawer] = useState(false);

	const layoutStyle: React.CSSProperties = {
		minHeight: '100vh',
		backgroundColor: token.colorBgBase,
	};

	const MainZapStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		padding: '32px',
		width: '100%',
		borderRadius: '25px',
		boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25), 0 -2px 4px rgba(0, 0, 0, 0.25)',
		backgroundColor: token.colorBgContainer,
		gap: '16px',
	};

	const footerStyle: React.CSSProperties = {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.1)',
		background: token.colorBgElevated,
	};

	const showLargeDrawer = () => setOpenDrawer(true);

	const onDrawerClose = () => setOpenDrawer(false);

	return (
		<Layout style={layoutStyle}>
			<CustomNavBar />
			<Content style={contentStyle}>
				<Drawer
					title="Automation Charts"
					placement="right"
					size="large"
					onClose={onDrawerClose}
					open={openDrawer}
					extra={
						<Space>
							<Button onClick={onDrawerClose}>Go back</Button>
						</Space>
					}
				>
					<AutomationUsageChart />
				</Drawer>
				<Layout style={MainZapStyle}>
					<AutomationTable openDrawer={openDrawer} setOpenDrawer={showLargeDrawer} />
				</Layout>
			</Content>
			<Footer style={footerStyle}>Area ©2023 Created by AREA EPITECH</Footer>
		</Layout>
	);
};

export default Dashboard;
