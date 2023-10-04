import React, { useState } from 'react';
import { BellOutlined, MenuOutlined, UserOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Avatar, Badge, Input, Layout, Space, Typography, Select, Button } from 'antd';
import { Footer } from 'antd/es/layout/layout';

const { Text } = Typography;
const { Header, Content } = Layout;

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

const contentStyle: React.CSSProperties = {
	padding: '100px 24px',
	color: '#000',
};

const MainZapStyle: React.CSSProperties = {
	alignItems: 'center',
	padding: '30px 0 50px 0',
	minHeight: '306px',
	borderRadius: '25px',
	boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25), 0 -2px 4px rgba(0, 0, 0, 0.25)',
	backgroundColor: '#FAFAFA',
	gap: '30px',
};

const TitleStyle: React.CSSProperties = {
	fontSize: 32,
	fontWeight: 'bold',
	color: '#000',
	alignSelf: 'center',
	paddingBottom: '50px',
};

const ZapStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
};

const DividerStyle: React.CSSProperties = {
	width: '68px',
	border: '1px solid #757575',
};

const InputStyle: React.CSSProperties = {
	width: '286px',
	height: '48px',
};

const footerStyle: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.1)',
	background: '#fff',
};

const serviceOptions = [
	{
		value: 'twitter',
		label: 'Twitter',
	},
	{
		value: 'google drive',
		label: 'Google Drive',
	},
	{
		value: 'google calandar',
		label: 'Google Calandar',
	},
	{
		value: 'gmail',
		label: 'Gmail',
	},
	{
		value: 'open meteo',
		label: 'Open Meteo',
	},
	{
		value: 'youtube',
		label: 'Youtube',
	},
];

const triggerOptions = [
	{
		value: 'receive like',
		label: 'Receive Like',
	},
	{
		value: 'receive replie',
		label: 'Receive Replie',
	},
	{
		value: 'new folder',
		label: 'New Folder',
	},
	{
		value: 'new file',
		label: 'New File',
	},
	{
		value: 'event',
		label: 'Event',
	},
	{
		value: 'birthday event',
		label: 'Birthday Event',
	},
	{
		value: 'hourly forecast',
		label: 'Hourly Forecast',
	},
	{
		value: 'liked video',
		label: 'Liked Video',
	},
	{
		value: 'new attachement',
		label: 'New Attachement',
	},
];

const reactionOptions = [
	{
		value: 'app notification',
		label: 'App Notification',
	},
	{
		value: 'send message',
		label: 'Send Message',
	},
	{
		value: 'send message',
		label: 'Send Message',
	},
	{
		value: 'send message',
		label: 'Send Message',
	},
	{
		value: 'send email',
		label: 'Send Email',
	},
	{
		value: 'add to playlist',
		label: 'Add to Playlist',
	},
	{
		value: 'upload file',
		label: 'Upload File',
	},
];

const Dashboard = () => {
	const [selectedService1, setSelectedService1] = useState<string | null>(null);
	const [selectedService2, setSelectedService2] = useState<string | null>(null);
	const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
	const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

	const onServiceChange1 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService1(value);
	};

	const onServiceChange2 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService2(value);
	};

	const onTriggerChange = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedTrigger(value);
	};

	const onReactionChange = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedReaction(value);
	};

	const onSearch = (value: string) => {
		console.log('search:', value);
	};

	const filterOption = (input: string, option?: { label: string; value: string }) =>
		(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
				<Layout style={MainZapStyle}>
					<Text style={TitleStyle}>Create a Zap</Text>
					<div style={ZapStyle}>
						<Select
							showSearch
							placeholder="Select a Service"
							optionFilterProp="children"
							onChange={onServiceChange1}
							onSearch={onSearch}
							filterOption={filterOption}
							style={InputStyle}
							options={serviceOptions}
						/>
						<span style={DividerStyle} />
						<PlusCircleOutlined style={{ fontSize: '32px', color: '#757575', padding: '0 5px' }} />
						<span style={DividerStyle} />
						<Select
							showSearch
							placeholder="Select a Service"
							optionFilterProp="children"
							onChange={onServiceChange2}
							onSearch={onSearch}
							filterOption={filterOption}
							style={InputStyle}
							options={serviceOptions}
						/>
					</div>
					{selectedService1 && selectedService2 ? (
						<div style={ZapStyle}>
							<Select
								showSearch
								placeholder="Select a Service"
								optionFilterProp="children"
								onChange={onTriggerChange}
								onSearch={onSearch}
								filterOption={filterOption}
								style={InputStyle}
								options={triggerOptions}
							/>
							<span style={DividerStyle} />
							<PlusCircleOutlined style={{ fontSize: '32px', color: '#757575', padding: '0 5px' }} />
							<span style={DividerStyle} />
							<Select
								showSearch
								placeholder="Select a Service"
								optionFilterProp="children"
								onChange={onReactionChange}
								onSearch={onSearch}
								filterOption={filterOption}
								style={InputStyle}
								options={reactionOptions}
							/>
						</div>
					) : null}
					{selectedTrigger && selectedReaction ? (
						<Button
							style={{
								alignItems: 'center',
								width: '200px',
								height: '50px',
								borderRadius: '50px',
								fontSize: '20px',
								fontWeight: 'bold',
							}}
						>
							Try It!
						</Button>
					) : null}
				</Layout>
			</Content>
			<Footer style={footerStyle}>Area ©2023 Created by AREA EPITECH</Footer>
		</Layout>
	);
};

export default Dashboard;
