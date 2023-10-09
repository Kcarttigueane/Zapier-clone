import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Select, Typography } from 'antd';
import { useState, useEffect } from 'react';
import Flex from '../../../core/components/Flex';
import { useAutomationStore } from '../../../core/store/useAutomationStore';
import useUserStore from '../../../core/store/useUserStore';
import { useAuthStore } from '../../../core/store/useAuthStore';
import { UserModel } from '../../../core/models/user';
import { use } from 'i18next';
import ConnectServiceButton from './AutomationConnectServiceButton';


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

const serviceOptions = [
	{
		value: 'youtube',
		label: 'YouTube',
	},
	{
		value: 'google drive',
		label: 'Google Drive',
	},
	{
		value: 'google calendar',
		label: 'Google Calendar',
	},
	{
		value: 'gmail',
		label: 'Gmail',
	},
	{
		value: 'spotify',
		label: 'Spotify',
	},
	{
		value: 'discord',
		label: 'Discord',
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
		value: 'add to playlist',
		label: 'Add to Playlist',
	},
	{
		value: 'upload file',
		label: 'Upload File',
	},
];

const service_to_token_dict: Record<string, string> = {
	'discord': 'discord_token',
	'google calendar': 'google_calendar_token',
	'google drive': 'google_drive_token',
	'gmail': 'google_gmail_token',
	'youtube': 'google_youtube_token',
	'spotify': 'spotify_token',
};

const service_to_route: Record<string, string> = {
	'google calendar': 'calendar',
	'google drive': 'drive',
	'gmail': 'gmail',
	'youtube': 'youtube',
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

	useEffect(() => {
		const fetchUser = async (accessToken: string) => {
			try {
				const userModel = await fetchCurrentUser(accessToken);
				if (userModel) {
					setUser(userModel);
				} else {
				}
			} catch (error) {
				console.error('Error fetching current user:', error);
			}
		};
		const userToken = localStorage.getItem('access_token');
		if (userToken) {
			fetchUser(userToken);
		}
	}, []);

	console.log("User: ", user);

	const { createAutomation } = useAutomationStore(state => state);

	const onServiceChange1 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService1(value);
		const service_token_name = service_to_token_dict[value];
		const token_manager = user['token_manager'];
		const service_obj = token_manager[service_token_name];
		const is_connected = service_obj != null;
		setServiceConnected1(is_connected);
	};

	const onServiceChange2 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService2(value);
		const service_token_name = service_to_token_dict[value];
		const token_manager = user['token_manager'];
		const service_obj = token_manager[service_token_name];
		const is_connected = service_obj != null;
		setServiceConnected2(is_connected);
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

	const handleConnectService = (service: string) => {
		const googleServices = ["google calendar", "gmail", "google drive", "youtube"];
		if (googleServices.includes(service)) {
			authorizeGoogleService(service_to_route[service]);
		} else if (service == "spotify") {
			authorizeSpotifyService()
		} else if (service == "discord") {
			authorizeDiscordService()
		}
	};

	return (
		<>
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
						options={serviceOptions}
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
						options={serviceOptions}
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
			{selectedTrigger && selectedReaction && selectedService1 && selectedService2 && user ? (
				<Flex justify-content="space-between" style={{ width: '40%' }}>
					<ConnectServiceButton service={selectedService1} connected={serviceConnected1} onClick={handleConnectService} style={{
						fontSize: '14px',
						fontWeight: 'bold',
						marginRight: 'auto',
					}}></ConnectServiceButton>
					<ConnectServiceButton service={selectedService2} connected={serviceConnected2} onClick={handleConnectService} style={{
						fontSize: '14px',
						fontWeight: 'bold',
						marginLeft: 'auto',
					}}></ConnectServiceButton>
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
					{serviceConnected1 && serviceConnected2 ? "Try It!" : "Authorize Services"}
				</Button>
			) : null}
		</>
	);
};

export default AutomationCreation;
