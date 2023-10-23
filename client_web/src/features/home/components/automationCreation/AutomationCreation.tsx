import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Select, Typography, message } from 'antd';
import { TFunction } from 'i18next';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';
import Flex from '../../../../core/components/Flex';
import ConnectServiceButton from '../AutomationConnectServiceButton';

import ServicesSelection from './ServicesSelection';

const { Text } = Typography;

const DividerStyle: React.CSSProperties = {
	width: '68px',
	border: '0.5px solid #757575',
	marginTop: '24px',
};

const InputStyle: React.CSSProperties = {
	width: '286px',
	height: '48px',
};

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
				const userModel = null; /* await fetchCurrentUser(accessToken); */
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

	// const checkServiceConnection = (value: string) => {
	// 	const serviceTokenName = serviceToTokenDict[value];
	// 	const tokenManager = user.token_manager;
	// 	const serviceObj = tokenManager[serviceTokenName];
	// 	return serviceObj != null;
	// };

	useEffect(() => {
		const checkCookies = () => {
			if (userLoaded) {
				// Check if user data has been loaded
				if (cookies['first-selected-service']) {
					setSelectedService1(cookies['first-selected-service']);
				}
				if (cookies['second-selected-service']) {
					setSelectedService2(cookies['second-selected-service']);
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

	// const { createAutomation } = useAutomationStore((state) => state);

	const onServiceChange1 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService1(value);
		setCookie('first-selected-service', (value = value));
	};

	const onServiceChange2 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService2(value);
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
			// authorizeGoogleService(serviceToRoute[service]);
		} else if (service == 'spotify') {
			// authorizeSpotifyService();
		} else if (service == 'discord') {
			// authorizeDiscordService();
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
			<ServicesSelection
				selectedService1={selectedService1}
				setSelectedService1={onServiceChange1}
				selectedService2={selectedService2}
				setSelectedService2={onServiceChange2}
			/>
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
								color: '#000',
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
					// onClick={createAutomation}
					disabled={!serviceConnected1 || !serviceConnected2}
				>
					{serviceConnected1 && serviceConnected2 ? t('home.create.enabled') : t('home.create.disabled')}
				</Button>
			) : null}
		</>
	);
};

export default AutomationCreation;
