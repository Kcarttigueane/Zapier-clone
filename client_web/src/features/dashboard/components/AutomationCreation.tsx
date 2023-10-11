import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Select, Typography } from 'antd';
import { useState } from 'react';
import Flex from '../../../core/components/Flex';

import TwitterIcon from '../../../core/assets/logo-svg-2D/Twitter.svg';
import GoogleDriveIcon from '../../../core/assets/logo-svg-2D/Google-drive.svg';
import GoogleCalandarIcon from '../../../core/assets/logo-svg-2D/Google-calendar.svg';
import GmailIcon from '../../../core/assets/logo-svg-2D/Gmail.svg';
import WeatherIcon from '../../../core/assets/logo-svg-2D/Weather.svg';
import YoutubeIcon from '../../../core/assets/logo-svg-2D/Youtube.svg';
import SpotifyIcon from '../../../core/assets/logo-svg-2D/Spotify.svg';
import NotificationIcon from '../../../core/assets/logo-svg-2D/Notification.svg';
import WhatsappIcon from '../../../core/assets/logo-svg-2D/Whatsapp.svg';
import SignalIcon from '../../../core/assets/logo-svg-2D/Signal.svg';
import DiscordIcon from '../../../core/assets/logo-svg-2D/Discord.svg';

const { Text } = Typography;

const TitleStyle: React.CSSProperties = {
	fontSize: 24,
	fontWeight: 'bold',
	alignSelf: 'center',
};

const DividerStyle: React.CSSProperties = {
	width: '68px',
	border: '0.5px solid #757575',
	marginTop: '24px',
};

const InputStyle: React.CSSProperties = {
	width: '286px',
	height: '48px',
};


const serviceOptions1 = [
	{
		value: 'twitter',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={TwitterIcon} alt="Twitter icon" style={{ width: '25px', marginRight: '8px' }} />
				Twitter
			</div>
		),
	},
	{
		value: 'google drive',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={GoogleDriveIcon} alt="Google Drive icon" style={{ width: '25px', marginRight: '8px' }} />
				Google Drive
			</div>
		),
	},
	{
		value: 'google calendar',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={GoogleCalandarIcon} alt="Twitter" style={{ width: '25px', marginRight: '8px' }} />
				Google Calandar
			</div>
		),
	},
	{
		value: 'gmail',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={GmailIcon} alt="Gmail icon" style={{ width: '25px', marginRight: '8px' }} />
				Gmail
			</div>
		),
	},
	{
		value: 'weahter',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={WeatherIcon} alt="Meteo icon" style={{ width: '25px', marginRight: '8px' }} />
				Weather
			</div>
		),
	},
	{
		value: 'youtube',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={YoutubeIcon} alt="Youtube icon" style={{ width: '25px', marginRight: '8px' }} />
				Youtube
			</div>
		),
	},
] as any;

const serviceOptions2 = [
	{
		value: 'notification',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={NotificationIcon} alt="Notification icon" style={{ width: '25px', marginRight: '8px' }} />
				Notification
			</div>
		),
	},
	{
		value: 'whatsapp',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={WhatsappIcon} alt="Whatsapp icon" style={{ width: '25px', marginRight: '8px' }} />
				Whatsapp
			</div>
		),
	},
	{
		value: 'signal',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={SignalIcon} alt="Signal icon" style={{ width: '25px', marginRight: '8px' }} />
				Signal
			</div>
		),
	},
	{
		value: 'discord',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={DiscordIcon} alt="Discord icon" style={{ width: '25px', marginRight: '8px' }} />
				Discord
			</div>
		),
	},

	{
		value: 'gmail',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={GmailIcon} alt="Gmail icon" style={{ width: '25px', marginRight: '8px' }} />
				Gmail
			</div>
		),
	},
	{
		value: 'spotify',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={SpotifyIcon} alt="Spotify icon" style={{ width: '25px', marginRight: '8px' }} />
				Spotify
			</div>
		),
	},
	{
		value: 'google drive',
		label: (
			<div style={{ display: 'flex', alignItems: 'center' }}>
				<img src={GoogleDriveIcon} alt="Google Drive icon" style={{ width: '25px', marginRight: '8px' }} />
				Google Drive
			</div>
		),
	},
] as any;

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
		value: 'add to playlist',
		label: 'Add to Playlist',
	},
	{
		value: 'upload file',
		label: 'Upload File',
	},
];

const AutomationCreation = () => {
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
		(option?.value ?? '').toLowerCase().includes(input.toLowerCase());

	return (
		<>
			<style>
			{`
				.ant-select-selection-search-input {
					padding-left: 30px !important;
				}
        	`}
			</style>
			<Text style={TitleStyle}>Create a Zap</Text>
			<Flex align="center" justify="center">
				<Flex direction="column" align="center" justify="center" gap="6px">

					<Text
						style={{
							fontSize: '14px',
							fontWeight: 'bold',
						}}
					>
						Connect this service...
					</Text>
					<Select
						showSearch
						placeholder="Select a Service"
						optionFilterProp="children"
						onChange={onServiceChange1}
						onSearch={onSearch}
						filterOption={filterOption}
						style={InputStyle}
						options={serviceOptions1}
					/>
				</Flex>
				<span style={DividerStyle} />
				<PlusCircleOutlined style={{ fontSize: '32px', color: '#757575', padding: '0 5px', marginTop: '24px' }} />
				<span style={DividerStyle} />
				<Flex direction="column" align="center" justify="center" gap="6px">
					<Text
						style={{
							fontSize: '14px',
							fontWeight: 'bold',
						}}
					>
						...with this one.
					</Text>
					<Select
						showSearch
						placeholder="Select a Service"
						optionFilterProp="children"
						onChange={onServiceChange2}
						onSearch={onSearch}
						filterOption={filterOption}
						style={InputStyle}
						options={serviceOptions2}
					/>
				</Flex>
			</Flex>
			{selectedService1 && selectedService2 ? (
				<Flex align="center" justify="center">
					<Flex direction="column" align="center" justify="center" gap="6px">
						<Text
							style={{
								fontSize: '14px',
								fontWeight: 'bold',
							}}
						>
							Choose a Trigger
						</Text>
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
					</Flex>
					<span style={DividerStyle} />
					<PlusCircleOutlined style={{ fontSize: '32px', color: '#757575', padding: '0 5px', marginTop: '24px' }} />
					<span style={DividerStyle} />
					<Flex direction="column" align="center" justify="center" gap="6px">
						<Text
							style={{
								fontSize: '14px',
								fontWeight: 'bold',
							}}
						>
							Choose a Reaction
						</Text>
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
					</Flex>
				</Flex>
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
		</>
	);
};

export default AutomationCreation;
