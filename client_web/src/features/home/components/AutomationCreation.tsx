import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Select, Typography, message } from 'antd';
import { TFunction } from 'i18next';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import Flex from '../../../core/components/Flex';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { useAutomationStore } from '../../../core/store/useAutomationStore';
import useUserStore from '../../../core/store/useUserStore';
import ConnectServiceButton from './AutomationConnectServiceButton';

import DiscordIcon from '../../../core/assets/logo-svg-2D/Discord.svg';
import GmailIcon from '../../../core/assets/logo-svg-2D/Gmail.svg';
import GoogleCalendarIcon from '../../../core/assets/logo-svg-2D/Google-calendar.svg';
import GoogleDriveIcon from '../../../core/assets/logo-svg-2D/Google-drive.svg';
import NotificationIcon from '../../../core/assets/logo-svg-2D/Notification.svg';
import SignalIcon from '../../../core/assets/logo-svg-2D/Signal.svg';
import SpotifyIcon from '../../../core/assets/logo-svg-2D/Spotify.svg';
import TwitterIcon from '../../../core/assets/logo-svg-2D/Twitter.svg';
import WeatherIcon from '../../../core/assets/logo-svg-2D/Weather.svg';
import WhatsappIcon from '../../../core/assets/logo-svg-2D/Whatsapp.svg';
import YoutubeIcon from '../../../core/assets/logo-svg-2D/Youtube.svg';

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
				<img src={GoogleCalendarIcon} alt="Twitter" style={{ width: '25px', marginRight: '8px' }} />
				Google Calendar
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
		value: 'weather',
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

const transformTriggerOptions = (t: TFunction) => {
	return [
		{
			value: 'receive like',
			label: t('home.trigger.like'),
		},
		{
			value: 'receive reply',
			label: t('home.trigger.reply'),
		},
		{
			value: 'new folder',
			label: t('home.trigger.folder'),
		},
		{
			value: 'new file',
			label: t('home.trigger.file'),
		},
		{
			value: 'event',
			label: t('home.trigger.event'),
		},
		{
			value: 'birthday event',
			label: t('home.trigger.birthday'),
		},
		{
			value: 'hourly forecast',
			label: t('home.trigger.forecast'),
		},
		{
			value: 'liked video',
			label: t('home.trigger.video'),
		},
		{
			value: 'new attachment',
			label: t('home.trigger.attachment'),
		},
	];
};

const transformReactionOptions = (t: TFunction) => {
	return [
		{
			value: 'app notification',
			label: t('home.reaction.notification'),
		},
		{
			value: 'send message',
			label: t('home.reaction.message'),
		},
		{
			value: 'add to playlist',
			label: t('home.reaction.playlist'),
		},
		{
			value: 'upload file',
			label: t('home.reaction.file'),
		},
	];
};

const serviceToTokenDict: Record<string, string> = {
	discord: 'discord_token',
	'google calendar': 'google_calendar_token',
	'google drive': 'google_drive_token',
	gmail: 'google_gmail_token',
	youtube: 'google_youtube_token',
	spotify: 'spotify_token',
};

const serviceToRoute: Record<string, string> = {
	'google calendar': 'calendar',
	'google drive': 'drive',
	gmail: 'gmail',
	youtube: 'youtube',
};

const AutomationCreation = () => {
	const [selectedService1, setSelectedService1] = useState<string | null>(null);
	const [selectedService2, setSelectedService2] = useState<string | null>(null);
	const [serviceConnected1, setServiceConnected1] = useState<boolean>(false);
	const [serviceConnected2, setServiceConnected2] = useState<boolean>(false);
	const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
	const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
	const { fetchCurrentUser } = useUserStore((state) => state);
	const { authorizeGoogleService, authorizeSpotifyService, authorizeDiscordService } = useAuthStore();
	const [user, setUser] = useState<any | null>(null);
	const [userLoaded, setUserLoaded] = useState(false);
	const [messageApi, contextHolder] = message.useMessage();
	const { t } = useTranslation();
	const [cookies, setCookie] = useCookies([
		'first-selected-service',
		'second-selected-service',
		'selected-trigger',
		'selected-reaction',
	]);

	useEffect(() => {
		const fetchUser = async (accessToken: string) => {
			try {
				const userModel = await fetchCurrentUser(accessToken);
				if (userModel) {
					setUser(userModel);
					setUserLoaded(true);
				}
			} catch (error) {
				console.error('Error fetching current user:', error);
				if (error instanceof Error) {
					messageApi.open({
						type: 'error',
						content: error.message || 'Something went wrong',
						duration: 1,
					});
				}
			}
		};
		const userToken = localStorage.getItem('access_token');
		if (userToken) {
			fetchUser(userToken);
		}
	}, []);

	const checkServiceConnection = (value: string) => {
		const serviceTokenName = serviceToTokenDict[value];
		const tokenManager = user.token_manager;
		const serviceObj = tokenManager[serviceTokenName];
		return serviceObj != null;
	};

	useEffect(() => {
		const checkCookies = () => {
			if (userLoaded) {
				// Check if user data has been loaded
				if (cookies['first-selected-service']) {
					setSelectedService1(cookies['first-selected-service']);
					setServiceConnected1(checkServiceConnection(cookies['first-selected-service']));
				}
				if (cookies['second-selected-service']) {
					setSelectedService2(cookies['second-selected-service']);
					setServiceConnected2(checkServiceConnection(cookies['second-selected-service']));
				}
				if (cookies['selected-trigger']) {
					setSelectedTrigger(cookies['selected-trigger']);
				}
				if (cookies['selected-reaction']) {
					setSelectedReaction(cookies['selected-reaction']);
				}
			}
		};
		checkCookies();
	}, [userLoaded]);

	const { createAutomation } = useAutomationStore((state) => state);

	const onServiceChange1 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService1(value);
		setServiceConnected1(checkServiceConnection(value));
		setCookie('first-selected-service', (value = value));
	};

	const onServiceChange2 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService2(value);
		setServiceConnected2(checkServiceConnection(value));
		setCookie('second-selected-service', (value = value));
	};

	const onTriggerChange = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedTrigger(value);
		setCookie('selected-trigger', (value = value));
	};

	const onReactionChange = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedReaction(value);
		setCookie('selected-reaction', (value = value));
	};

	const onSearch = (value: string) => {
		console.log('search:', value);
	};

	const filterOption = (input: string, option?: { label: string; value: string }) =>
		(option?.value ?? '').toLowerCase().includes(input.toLowerCase());

	const handleConnectService = (service: string) => {
		const googleServices = ['google calendar', 'gmail', 'google drive', 'youtube'];
		if (googleServices.includes(service)) {
			authorizeGoogleService(serviceToRoute[service]);
		} else if (service == 'spotify') {
			authorizeSpotifyService();
		} else if (service == 'discord') {
			authorizeDiscordService();
		}
	};

	return (
		<>
			<style>
				{`
				.ant-select-selection-search-input {
					padding-left: 30px !important;
				}
        	`}
			</style>
			{contextHolder}
			<Text style={TitleStyle}>{t('home.create.title')}</Text>
			<Flex align="center" justify="center">
				<Flex direction="column" align="center" justify="center" gap="6px">
					<Text
						style={{
							fontSize: '14px',
							fontWeight: 'bold',
						}}
					>
						{t('home.create.action1')}
					</Text>
					<Select
						showSearch
						value={selectedService1}
						placeholder={t('home.create.service')}
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
						{t('home.create.reaction1')}
					</Text>
					<Select
						showSearch
						value={selectedService2}
						placeholder={t('home.create.service')}
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
							{t('home.create.action2')}
						</Text>
						<Select
							showSearch
							value={selectedTrigger}
							placeholder={t('home.create.action2')}
							optionFilterProp="children"
							onChange={onTriggerChange}
							onSearch={onSearch}
							filterOption={filterOption}
							style={InputStyle}
							options={transformTriggerOptions(t)}
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
							{t('home.create.reaction2')}
						</Text>
						<Select
							showSearch
							value={selectedReaction}
							placeholder={t('home.create.reaction2')}
							optionFilterProp="children"
							onChange={onReactionChange}
							onSearch={onSearch}
							filterOption={filterOption}
							style={InputStyle}
							options={transformReactionOptions(t)}
						/>
					</Flex>
				</Flex>
			) : null}
			{selectedTrigger &&
			selectedReaction &&
			selectedService1 &&
			selectedService2 &&
			user &&
			(!serviceConnected1 || !serviceConnected2) ? (
				<Flex justify-content="space-between" style={{ width: '40%' }}>
					<ConnectServiceButton
						service={selectedService1}
						connected={serviceConnected1}
						onClick={handleConnectService}
						style={{
							fontSize: '14px',
							fontWeight: 'bold',
							marginRight: 'auto',
						}}
					/>
					<ConnectServiceButton
						service={selectedService2}
						connected={serviceConnected2}
						onClick={handleConnectService}
						style={{
							fontSize: '14px',
							fontWeight: 'bold',
							marginLeft: 'auto',
						}}
					/>
				</Flex>
			) : null}
			{selectedTrigger && selectedReaction ? (
				<Button
					style={{
						alignItems: 'center',
						width: '200px',
						height: '50px',
						borderRadius: '50px',
						fontSize: serviceConnected1 && serviceConnected2 ? '20px' : '14px',
						fontWeight: 'bold',
					}}
					onClick={createAutomation}
					disabled={!serviceConnected1 || !serviceConnected2}
				>
					{serviceConnected1 && serviceConnected2 ? t('home.create.enabled') : t('home.create.disabled')}
				</Button>
			) : null}
		</>
	);
};

export default AutomationCreation;
