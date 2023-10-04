import { Avatar, Button, Card, Image, Layout, Space, Typography, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import ConnectedServices from '../../settings/components/ConnectedServices';
import GeneralSettings from '../../settings/components/GeneralSettings';
import HelpAndSupport from '../../settings/components/HelpAndSupport';
import { useTranslation } from 'react-i18next';

import Meta from 'antd/es/card/Meta';
import { useNavigate } from 'react-router-dom';
import AppStoreLogo from '../../../core/assets/demo_page/app_store.png';
import ConnectApps from '../../../core/assets/demo_page/connectedAppsCard.png';
import GoogleStoreLogo from '../../../core/assets/demo_page/google_store.png';
import TriggerAction from '../../../core/assets/demo_page/triggerActionCard.png';
import WorkflowLogo from '../../../core/assets/demo_page/workflowCard.png';
import DiscordLogo from '../../../core/assets/logo3D/Discord.png';
import RedditLogo from '../../../core/assets/logo3D/Reddit.png';
import SpotifyLogo from '../../../core/assets/logo3D/Spotify.png';
import TinderLogo from '../../../core/assets/logo3D/Tinder.png';
import TwitterLogo from '../../../core/assets/logo3D/Twitter.png';
import WhatAppsLogo from '../../../core/assets/logo3D/Whatsapp.png';
import YoutubeLogo from '../../../core/assets/logo3D/Youtube.png';
import GoogleLogo from '../../../core/assets/logo3D/google.png';
import CustomFooter from '../../../core/components/CustomFooter';
import Flex from '../../../core/components/Flex';

const { Text } = Typography;

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

const contentStyle: React.CSSProperties = {
	padding: '0 24px',
	color: '#000',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	flexDirection: 'column',
	marginTop: '50px',
	gap: '50px',
};

const titleStyle: React.CSSProperties = {
	fontSize: 28,
	fontWeight: 'bold',
	color: '#000',
};

const automationKeyStyle: React.CSSProperties = {
	width: '100%',
	backgroundColor: '#EEEEEE',
	height: '600px',
	boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.4)',
	borderRadius: '20px',
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'space-around',
};

const guideStyle: React.CSSProperties = {
	width: '100%',
	backgroundColor: '#EEEEEE',
	height: '600px',
	boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.4)',
	borderRadius: '20px',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'space-around',
	paddingTop: '40px',
	paddingBottom: '40px',
	marginBottom: '20px',
};

const Landing: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();

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
		<>
			<Layout style={layoutStyle}>
				<Header style={headerStyle}>
					<Space>
						<Avatar size={60} src={<img src={'/logo.jpg'} alt="Logo" />} />
						<Text
							style={{
								margin: '0 0 0 16px',
								alignSelf: 'center',
								fontWeight: 'bold',
								fontSize: 24,
								justifySelf: 'center',
							}}
						>
							Area.
						</Text>
					</Space>
					<Space size="large">
						<Button type="text" shape="round" size="large" onClick={() => navigate('/auth/login')}>
						{t('auth.login.title')}
						</Button>
						<Button shape="round" size="large" onClick={() => navigate('/auth/register')}>
						{t('auth.register.title')}
						</Button>
					</Space>
				</Header>
				<Content style={contentStyle}>
					<div style={automationKeyStyle}>
						<Flex align="center" justify="space-between" gap={24}>
							<Image width={120} src={GoogleLogo} alt="Logo Google" preview={false} />
							<div>
								<p style={{ fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginTop: 0 }}>{t('demo_guides.automation.title')}</p>
								<p style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'center' }}>{t('demo_guides.automation.description')}</p>
							</div>
							<Image width={120} src={DiscordLogo} alt="Logo Discord" preview={false} />
						</Flex>

						<Flex align="center" justify="space-around" gap={24}>
							<Image width={120} src={TinderLogo} alt="Logo Tinder" preview={false} />

							<Image width={120} src={RedditLogo} alt="Logo Reddit" preview={false} />
							<Image width={120} src={TwitterLogo} alt="Logo Twitter" preview={false} />
						</Flex>

						<Flex align="center" justify="space-evenly" gap={24}>
							<Image width={120} src={SpotifyLogo} alt="Logo Twitter" preview={false} />
							<Image width={120} src={WhatAppsLogo} alt="Logo Twitter" preview={false} />
							<Image width={120} src={GoogleLogo} alt="Logo Twitter" preview={false} />
							<Image width={120} src={YoutubeLogo} alt="Logo Twitter" preview={false} />
						</Flex>
					</div>
					<Flex align="center" justify="space-around" gap={24} style={{ width: '100%' }}>
						<Flex direction="column" justify="flex-start">
							<>
								<Text style={titleStyle}>{t('demo_guides.connect.p1')}</Text>
								<Text style={titleStyle}>{t('demo_guides.connect.p2')}</Text>
								<Text style={titleStyle}>{t('demo_guides.connect.p3')}</Text>
							</>

							<ul style={{ marginTop: '24px' }}>
								<li style={{ fontSize: 16, fontWeight: 'bold' }}>{t('demo_guides.connect.el1')}</li>
								<li style={{ fontSize: 16, fontWeight: 'bold' }}>{t('demo_guides.connect.el2')}</li>
								<li style={{ fontSize: 16, fontWeight: 'bold' }}>{t('demo_guides.connect.el3')}</li>
							</ul>
							<Space style={{ marginTop: '32px', alignSelf: 'center' }} size={24}>
								<Image width={180} src={GoogleStoreLogo} alt="Logo Tinder" preview={false} />
								<Image width={180} src={AppStoreLogo} alt="Logo Tinder" preview={false} />
							</Space>
						</Flex>
						<div style={{ display: 'flex', flexDirection: 'row' }}>
							<img
								src="../src/core/assets/demo_page/mockup_phone.png"
								alt="mockup phone"
								style={{ width: 252, height: 413 }}
							/>
							<img
								src="../src/core/assets/demo_page/second_mockup_phone.png"
								alt="second_mockup_phone"
								style={{ width: 184, height: 341, marginTop: 72 }}
							/>
						</div>
					</Flex>
					<div style={guideStyle}>
						<Card
							style={{ width: 500, borderRadius: '20px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
							cover={<Image src={WorkflowLogo} alt="Workflow" width={500} style={{ padding: 24 }} preview={false} />}
						>
							<Meta
								style={{ textAlign: 'center' }}
								title={t('demo_guides.slide1.title')}
								description={t('demo_guides.slide1.description')}
							/>
						</Card>
						<Card
							style={{ width: 500, borderRadius: '20px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
							cover={<Image src={TriggerAction} alt="Workflow" width={500} style={{ padding: 24 }} preview={false} />}
						>
							<Meta
								style={{ textAlign: 'center' }}
								title={t('demo_guides.slide2.title')}
								description={t('demo_guides.slide2.description')}
							/>
						</Card>
						<Card
							style={{ width: 500, borderRadius: '20px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
							cover={<Image src={ConnectApps} alt="Workflow" width={500} style={{ padding: 24 }} preview={false} />}
						>
							<Meta
								style={{ textAlign: 'center' }}
								title={t('demo_guides.slide3.title')}
								description={t('demo_guides.slide3.description')}
							/>
						</Card>
					</div>
				</Content>
				<CustomFooter />
			</Layout>
		</>
	);
};

export default Landing;
