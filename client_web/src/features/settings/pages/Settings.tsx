import { BellOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Image, Input, Layout, Space, theme } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import Flex from '../../../core/components/Flex';
import ConnectedServices from '../components/ConnectedServices';
import GeneralSettings from '../components/GeneralSettings';
import HelpAndSupport from '../components/HelpAndSupport';
import SettingsMenu from '../components/SettingsMenu';

const layoutStyle: React.CSSProperties = {
	minHeight: '100vh',
	backgroundColor: '#fff',
};

const headerStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	margin: '12px 24px',
	borderRadius: '50px',
	boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
	backgroundColor: '#fff',
};

const searchBarStyle: React.CSSProperties = {
	width: '300px',
};

const rightHeaderStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	borderRadius: '50px',
	border: '1px solid #d9d9d9',
	height: '50px',
	padding: '8px 12px',
};

const imageStyle: React.CSSProperties = {
	borderRadius: '50%',
	padding: '2px',
	background: 'linear-gradient(#1BFFFF, #2E3192), linear-gradient(to left,  #1BFFFF, #2E3192)',
	backgroundOrigin: 'border-box',
	backgroundClip: 'content-box, border-box',
};

const contentStyle: React.CSSProperties = {
	padding: '0 24px',
	color: '#000',
	display: 'flex',
	alignItems: 'center',
};

const footerStyle: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.1)',
	background: '#fff',
};

const { Header, Content } = Layout;

const Settings = () => {
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const [selectedMenu, setSelectedMenu] = useState<string>('1');

	const renderRightContent = () => {
		switch (selectedMenu) {
			case '1':
				return <GeneralSettings />;
			case '2':
				return <ConnectedServices />;
			case '3':
				return <HelpAndSupport />;
			default:
				return null;
		}
	};

	useEffect(() => {
		console.log(selectedMenu);
	}, [selectedMenu]);

	return (
		<Layout style={layoutStyle}>
			<Header style={headerStyle}>
				<Space>
					<Avatar size={60} src={<img src={'/logo.jpg'} alt="Logo" />} />
					<p style={{ margin: '0 0 0 16px' }}>Area.</p>
				</Space>
				<Input.Search placeholder="input search text" size="large" allowClear bordered style={searchBarStyle} />
				<Space style={rightHeaderStyle} size="large">
					<Badge count={5} size="small">
						<BellOutlined style={{ fontSize: '20px' }} />
					</Badge>
					<MenuOutlined style={{ fontSize: '20px' }} />
					<Avatar size="large" icon={<UserOutlined />} />
				</Space>
			</Header>
			<Content style={contentStyle}>
				<Layout style={{ padding: '24px 0', background: colorBgContainer }}>
					<Content style={{ padding: '0 24px', color: '#000', width: '100%' }}>
						<Flex direction="row" align="center" justify="space-around" gap="60px">
							<Flex direction="column" align="center" justify="center" gap="48px" style={{ flex: '2' }}>
								<Image
									width={180}
									src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
									style={imageStyle}
								/>
								<SettingsMenu onSelect={(key) => setSelectedMenu(key)} />
							</Flex>
							<div style={{ marginLeft: '48px', flex: '3' }}>{renderRightContent()}</div>
						</Flex>
					</Content>
				</Layout>
			</Content>
			<Footer style={footerStyle}>Area ©2023 Created by AREA EPITECH</Footer>
		</Layout>
	);
};

export default Settings;
