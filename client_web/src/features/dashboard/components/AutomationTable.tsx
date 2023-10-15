import { Table, Typography, message, Image, Popconfirm, Switch, Space, Input, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState, useEffect } from 'react';
import useUserStore from '../../../core/store/useUserStore';
import { useTranslation } from 'react-i18next';
import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { useAutomationStore } from '../../../core/store/useAutomationStore';
import Spotify from '../../../core/assets/logo2D/Spotify.png';
import Youtube from '../../../core/assets/logo2D/Youtube.png';
import Discord from '../../../core/assets/logo2D/Discord.png';
import Gmail from '../../../core/assets/logo2D/Gmail.png';
import GoogleDrive from '../../../core/assets/logo2D/GoogleDrive.png';
import GoogleCalendar from '../../../core/assets/logo2D/GoogleCalandar.png';
import Tinder from '../../../core/assets/logo2D/Tinder.png'
import { act } from 'react-dom/test-utils';


const { Text } = Typography;

const calculateTimeAgo = (timestamp: string) => {
	const currentTime = new Date();
	const parsedTimestamp = new Date(timestamp);

	const timeDifferenceInSeconds: number = Math.floor(
		(currentTime.getTime() - parsedTimestamp.getTime()) / 1000
	);

	if (timeDifferenceInSeconds < 60) {
		return `${timeDifferenceInSeconds} seconds ago`;
	} else if (timeDifferenceInSeconds < 3600) {
		const minutesAgo = Math.floor(timeDifferenceInSeconds / 60);
		return `${minutesAgo} minute${minutesAgo > 1 ? 's' : ''} ago`;
	} else if (timeDifferenceInSeconds < 86400) {
		const hoursAgo = Math.floor(timeDifferenceInSeconds / 3600);
		return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
	} else {
		const weeksAgo = Math.floor(timeDifferenceInSeconds / 604800);
		return `${weeksAgo} week${weeksAgo > 1 ? 's' : ''} ago`;
	}
};

interface DataType {
	key: React.Key;
	service: string;
	name: string;
	lastPolled: string;
}

function transformAutomationsToDataTable(automations: any[]): any[] {
	return automations.map((automation, index) => ({
		name: automation['name'],
		lastPolled: calculateTimeAgo(automation['last_polled']),
		running: "True",
		key: (index).toString(),
	}));
};

const serviceToImageSrc: Record<string, string> = {
	'discord': Discord,
	'calendar': GoogleCalendar,
	'drive': GoogleDrive,
	'gmail': Gmail,
	'youtube': Youtube,
	'spotify': Spotify,
	'tinder': Tinder,
};


const AutomationTable = () => {
	const { fetchCurrentUser } = useUserStore((state) => state);
	const [inputString, setInputString] = useState<string>("");
	const { t } = useTranslation();
	const [messageApi, contextHolder] = message.useMessage();
	const [automations, setAutomations] = useState<Array<any>>([]);
	const [displayAutomations, setDisplayAutomations]	= useState<Array<any>>([]);
	const { updateAutomation, deleteAutomation } = useAutomationStore(state => state);

	const handleDelete = (key: React.Key) => {
		const keyAsNumber = Number(key);
		deleteAutomation(automations[keyAsNumber]);
		const updatedAutomations = automations.filter((_, index) => index !== keyAsNumber);
		setAutomations(updatedAutomations);
	};

	const handleSwitchRunning = (key: React.Key) => (newState: boolean) => {
		const keyAsNumber = Number(key);
		const updatedAutomations = [...automations];
		updatedAutomations[keyAsNumber] = { ...updatedAutomations[keyAsNumber], active: newState };
		setAutomations(updatedAutomations);
		updateAutomation(updatedAutomations[keyAsNumber]);
	};

	const columns: ColumnsType<DataType> = [
		{
			title: 'Services',
			key: 'service',
			dataIndex: 'service',
			render: (_, record: { key: React.Key }) => {
				const keyAsNumber = Number(record.key);
				const actionImage = serviceToImageSrc[displayAutomations[keyAsNumber]['action_service'].toLowerCase()];
				const reactionImage = serviceToImageSrc[displayAutomations[keyAsNumber]['reaction_service'].toLowerCase()];
				console.log("Action Image: ", actionImage);
				return (
					<div>
						<div style={{ border: '1px solid #ccc', width: '30px', height: '30px', margin: '5px', display: 'inline-block', verticalAlign: 'top' }}>
							<Image src={actionImage} style={{ width: '100%', height: '100%' }} />
						</div>
						<div style={{ border: '1px solid #ccc', width: '30px', height: '30px', margin: '5px', display: 'inline-block', verticalAlign: 'top' }}>
							<Image src={reactionImage} style={{ width: '100%', height: '100%' }} />
						</div>
					</div>
				);
			},
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Last Polled',
			dataIndex: 'lastPolled',
			key: 'lastPolled',
		},
		{
			title: '',
			key: 'operation',
			dataIndex: 'operation',
			width: 100,
			render: (_, record: { key: React.Key }) => (
				<Popconfirm title={"Sure to delete?"} icon={<ExclamationCircleFilled color='blue' />} onConfirm={() => handleDelete(record.key)}>
					<a>
						<DeleteOutlined style={{ fontSize: '20px', color: 'red' }} />
					</a>
				</Popconfirm>

			),
		},
		{
			title: 'Running',
			dataIndex: 'running',
			key: 'running',
			width: 100,
			render: (_, record: { key: React.Key }) => {
				const keyAsNumber = Number(record.key);

				return (
					<a>
						<Switch checked={displayAutomations[keyAsNumber]['active']} onChange={handleSwitchRunning(record.key)} />
					</a>
				);
			},
		},
	];



	useEffect(() => {
		const fetchUser = async (accessToken: string) => {
			try {
				const userModel = await fetchCurrentUser(accessToken);
				if (userModel) {
					const userAutomations = userModel['automations'];
					console.log("Automations: ", userAutomations);
					setAutomations(userAutomations);
					setDisplayAutomations(userAutomations);
				}
			} catch (error) {
				console.error('Error fetching current user:', error);
				if (error instanceof Error) {
					messageApi.open({
						type: 'error',
						content: error.message || 'Something went wrong',
						duration: 5,
					});
				}
			}
		};
		const userToken = localStorage.getItem('access_token');
		if (userToken) {
			fetchUser(userToken);
		}
	}, []);



	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputString(event.target.value);
		let filteredAutomations = automations;
		if (event.target.value != "") {
			filteredAutomations = automations.filter((automation) => {
				const nameMatches = automation['name'].toLowerCase().includes(inputString.toLowerCase());
				const actionMatches = automation['action_service'].toLowerCase().includes(inputString.toLowerCase());
				const reactionMatches = automation['reaction_service'].toLowerCase().includes(inputString.toLowerCase());

				return nameMatches || actionMatches || reactionMatches;
			});
		}
		setDisplayAutomations(filteredAutomations);
	};

	return (
		<>
			{contextHolder}
			<Space.Compact style={{ width: '90%' }}>
				<Input defaultValue="Combine input and button" size='large' onChange={handleInputChange} value={inputString} placeholder='Filter Automations' />
				<Button type="primary" style={{ backgroundColor: 'black' }} size='large'>Submit</Button>
			</Space.Compact>
			{automations !== null ? (
				<Table columns={columns} dataSource={transformAutomationsToDataTable(displayAutomations)} style={{ width: "90%" }} />
			) : null}
		</>
	);
};

export default AutomationTable;