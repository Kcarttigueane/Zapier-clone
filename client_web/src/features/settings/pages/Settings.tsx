import { Image, Layout, Space, theme } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { useState } from 'react';
import CustomNavBar from '../../../core/components/CustomNavBar';
import ConnectedServices from '../components/ConnectedServices';
import GeneralSettings from '../components/GeneralSettings';
import HelpAndSupport from '../components/HelpAndSupport';
import SettingsMenu from '../components/SettingsMenu';
import Language from '../components/Language';
import useUserStore from '../../../core/zustand/useUserStore';
import { base64ToImageUrl, baseUserProfileBase64 } from '../../../core/utils/base64ToImageUrl';


const layoutStyle: React.CSSProperties = {
	minHeight: '100vh',
	backgroundColor: '#fff',
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

const { Content } = Layout;

const Settings = () => {
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const [selectedMenu, setSelectedMenu] = useState<string>('1');
	const { user } = useUserStore((state) => state);


	const renderRightContent = () => {
		switch (selectedMenu) {
			case '1':
				return <GeneralSettings />;
			case '2':
				return <ConnectedServices />;
			case '3':
				return <Language />;
			case '4':
				return <HelpAndSupport />;
			default:
				return null;
		}
	};

	return (
		<Layout style={layoutStyle}>
			<CustomNavBar />
			<Content style={contentStyle}>
				<Layout
					style={{
						padding: '24px 0',
						background: colorBgContainer,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Space direction="horizontal" size={120}>
						<Space direction="vertical" size="large" align="center">
							<Image
								width={180}
								height={180}
								src={base64ToImageUrl(user?.profile.profile_picture || baseUserProfileBase64)}
								style={imageStyle}
							/>
							<SettingsMenu onSelect={(key) => setSelectedMenu(key)} />
						</Space>
						{renderRightContent()}
					</Space>
				</Layout>
			</Content>
			<Footer style={footerStyle}>Area ©2023 Created by AREA EPITECH</Footer>
		</Layout>
	);
};

export default Settings;
