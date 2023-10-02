import { Avatar, Button, Card, Image, Layout, Space, Typography, theme } from 'antd';
import { Content, Header } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import ConnectedServices from '../../settings/components/ConnectedServices';
import GeneralSettings from '../../settings/components/GeneralSettings';
import HelpAndSupport from '../../settings/components/HelpAndSupport';

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
	const {
		token: { colorBgContainer },
	} = theme.useToken();

	const handleLogin = () => {
		alert('Bouton Login cliqué !');
	};

	const handleStarted = () => {
		alert('Bouton Get started cliqué !');
	};

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
							Log In
						</Button>
						<Button shape="round" size="large" onClick={() => navigate('/auth/register')}>
							Get Started
						</Button>
					</Space>
				</Header>
				<Content style={contentStyle}>
					<div style={automationKeyStyle}>
						<Flex align="center" justify="space-between" gap={24}>
							<Image width={120} src={GoogleLogo} alt="Logo Google" preview={false} />
							<div>
								<p style={{ fontSize: 60, fontWeight: 'bold', textAlign: 'center', marginTop: 0 }}>Automation is key</p>
								<p style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'center' }}>Save time and get more done</p>
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
								<Text style={titleStyle}>Connect your favorite service to create</Text>
								<Text style={titleStyle}>a seamless digital directly from your</Text>
								<Text style={titleStyle}>smart phone.</Text>
							</>

							<ul style={{ marginTop: '24px' }}>
								<li style={{ fontSize: 16, fontWeight: 'bold' }}>Intelligent Triggers & Reactions</li>
								<li style={{ fontSize: 16, fontWeight: 'bold' }}>Sync with the Web App</li>
								<li style={{ fontSize: 16, fontWeight: 'bold' }}>Secure & Private</li>
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
								title="Build custom workflows in minutes "
								description="Automate the busy work, so you can focus on your job, not your tools We'll show you how"
							/>
						</Card>
						<Card
							style={{ width: 500, borderRadius: '20px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
							cover={<Image src={TriggerAction} alt="Workflow" width={500} style={{ padding: 24 }} preview={false} />}
						>
							<Meta
								style={{ textAlign: 'center' }}
								title="Get more power from your tools"
								description="Integrate your critical work apps into workflows, reclaim your time, and focus on impactful work."
							/>
						</Card>
						<Card
							style={{ width: 500, borderRadius: '20px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}
							cover={<Image src={ConnectApps} alt="Workflow" width={500} style={{ padding: 24 }} preview={false} />}
						>
							<Meta
								style={{ textAlign: 'center' }}
								title="Connect the apps you already love"
								description="Zapier supports more apps than any other platform, so you can optimize the tools you use."
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
