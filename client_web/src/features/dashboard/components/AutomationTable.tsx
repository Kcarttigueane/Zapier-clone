import { DeleteOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Image, Popconfirm, Space, Switch, Table, message } from 'antd';
import Search from 'antd/es/input/Search';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import Discord from '../../../core/assets/logo2D/Discord.png';
import Gmail from '../../../core/assets/logo2D/Gmail.png';
import GoogleCalendar from '../../../core/assets/logo2D/GoogleCalandar.png';
import GoogleDrive from '../../../core/assets/logo2D/GoogleDrive.png';
import Spotify from '../../../core/assets/logo2D/Spotify.png';
import Tinder from '../../../core/assets/logo2D/Tinder.png';
import Youtube from '../../../core/assets/logo2D/Youtube.png';
import { useAutomationStore } from '../../../core/store/useAutomationStore';
import useUserStore from '../../../core/store/useUserStore';
import { transformAutomationsToDataTable } from '../utils/dashboardUtils';
import { useTranslation } from 'react-i18next';



interface DataType {
	key: React.Key;
	service: string;
	name: string;
	lastPolled: string;
}

const serviceToImageSrc: Record<string, string> = {
	discord: Discord,
	calendar: GoogleCalendar,
	drive: GoogleDrive,
	gmail: Gmail,
	youtube: Youtube,
	spotify: Spotify,
	tinder: Tinder,
};

const AutomationTable = () => {
	const { fetchCurrentUser } = useUserStore((state) => state);
	const [inputString, setInputString] = useState<string>('');
	const [messageApi, contextHolder] = message.useMessage();
	const [automations, setAutomations] = useState<Array<any>>([]);
	const [displayAutomations, setDisplayAutomations] = useState<Array<any>>([]);
	const { updateAutomation, deleteAutomation } = useAutomationStore((state) => state);
	const { t } = useTranslation();

	useEffect(() => {
		const fetchUser = async (accessToken: string) => {
			try {
				const userModel = await fetchCurrentUser(accessToken);
				if (userModel) {
					const userAutomations = userModel.automations;
					setAutomations(userAutomations);
					setDisplayAutomations(userAutomations);
				}
			} catch (error) {
				console.error('Error fetching current user:', error);
				if (error instanceof Error) {
					messageApi.open({
						type: 'error',
						content: error.message || t('error'),
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

	const handleDelete = (key: React.Key) => {
		const keyAsNumber = Number(key);
		deleteAutomation(automations[keyAsNumber]);
		const updatedAutomations = automations.filter((_, index) => index !== keyAsNumber);
		setAutomations(updatedAutomations);
		setDisplayAutomations(updatedAutomations);
	};

	const handleSwitchRunning = (key: React.Key) => (newState: boolean) => {
		const keyAsNumber = Number(key);
		const updatedAutomations = [...automations];
		updatedAutomations[keyAsNumber] = { ...updatedAutomations[keyAsNumber], active: newState };
		setAutomations(updatedAutomations);
		setDisplayAutomations(updatedAutomations);
		updateAutomation(updatedAutomations[keyAsNumber]);
	};

	const columns: ColumnsType<DataType> = [
		{
			title: t('dashboard.service'),
			key: 'service',
			dataIndex: 'service',
			render: (_, record: { key: React.Key }) => {
				const keyAsNumber = Number(record.key);
				const actionImage = serviceToImageSrc[displayAutomations[keyAsNumber].action_service.toLowerCase()];
				const reactionImage = serviceToImageSrc[displayAutomations[keyAsNumber].reaction_service.toLowerCase()];
				return (
					<div>
						<div
							style={{
								border: '1px solid #ccc',
								width: '30px',
								height: '30px',
								margin: '5px',
								display: 'inline-block',
								verticalAlign: 'top',
							}}
						>
							<Image src={actionImage} style={{ width: '100%', height: '100%' }} />
						</div>
						<div
							style={{
								border: '1px solid #ccc',
								width: '30px',
								height: '30px',
								margin: '5px',
								display: 'inline-block',
								verticalAlign: 'top',
							}}
						>
							<Image src={reactionImage} style={{ width: '100%', height: '100%' }} />
						</div>
					</div>
				);
			},
		},
		{
			title: t('dashboard.name'),
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: t('dashboard.polled'),
			dataIndex: 'lastPolled',
			key: 'lastPolled',
		},
		{
			title: '',
			key: 'operation',
			dataIndex: 'operation',
			width: 100,
			render: (_, record: { key: React.Key }) => (
				<Popconfirm
					title={t('dashboard.confirm')}
					icon={<ExclamationCircleFilled color="blue" />}
					onConfirm={() => handleDelete(record.key)}
				>
					<a>
						<DeleteOutlined style={{ fontSize: '20px', color: 'red' }} />
					</a>
				</Popconfirm>
			),
		},
		{
			title: t('dashboard.running'),
			dataIndex: 'running',
			key: 'running',
			width: 100,
			render: (_, record: { key: React.Key }) => {
				const keyAsNumber = Number(record.key);

				return (
					<a>
						<Switch checked={displayAutomations[keyAsNumber].active} onChange={handleSwitchRunning(record.key)} />
					</a>
				);
			},
		},
	];

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputString(event.target.value);
		let filteredAutomations = automations;
		if (event.target.value != '') {
			filteredAutomations = automations.filter((automation) => {
				const nameMatches = automation.name.toLowerCase().includes(inputString.toLowerCase());
				const actionMatches = automation.action_service.toLowerCase().includes(inputString.toLowerCase());
				const reactionMatches = automation.reaction_service.toLowerCase().includes(inputString.toLowerCase());

				return nameMatches || actionMatches || reactionMatches;
			});
		}
		setDisplayAutomations(filteredAutomations);
	};

	return (
		<>
			{contextHolder}
			<Space.Compact style={{ width: '90%' }}>
				<Search
					defaultValue="Combine input and button"
					size="large"
					onChange={handleInputChange}
					value={inputString}
					placeholder={t('dashboard.filter')}
					allowClear
				/>
			</Space.Compact>
			{automations !== null ? (
				<Table
					locale={{ emptyText: 'No Current Automations' }}
					columns={columns}
					dataSource={transformAutomationsToDataTable(displayAutomations)}
					style={{ width: '90%' }}
				/>
			) : null}
		</>
	);
};

export default AutomationTable;
