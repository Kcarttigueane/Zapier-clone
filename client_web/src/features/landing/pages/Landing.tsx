import { Layout, Menu, MenuProps, theme } from 'antd';
import React from 'react';
import CustomFooter from '../../../core/components/CustomFooter';

const { Header, Content } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
	key,
	label: `nav ${key}`,
}));

const layoutStyle: React.CSSProperties = {
	minHeight: '100vh',
};

const Landing: React.FC = () => {
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	return (
		<Layout style={layoutStyle}>
			<Header style={{ display: 'flex', alignItems: 'center' }}>
				<div className="demo-logo" />
				<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />
			</Header>
			<Content style={{ padding: '0 50px' }}>
				<Layout style={{ padding: '24px 0', background: colorBgContainer }}>
					<Content style={{ padding: '0 24px', minHeight: 280, color: '#000' }}>Content</Content>
				</Layout>
			</Content>
			<CustomFooter />
		</Layout>
	);
};

export default Landing;
