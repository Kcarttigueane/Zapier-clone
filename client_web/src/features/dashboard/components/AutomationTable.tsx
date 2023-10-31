import { DeleteTwoTone, ExclamationCircleTwoTone, InfoCircleTwoTone, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Image, Popconfirm, Row, Space, Switch, Table, Typography, message } from 'antd';
import Search from 'antd/es/input/Search';
import type { ColumnsType } from 'antd/es/table';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AutomationCreationDTO, AutomationStatus, DetailedAutomationDTO } from '../../../core/models/automation';
import { useAuthStore } from '../../../core/zustand/useAuthStore';
import useAutomationStore from '../../../core/zustand/useAutomation';
import ConnectServiceButton from '../../home/components/AutomationConnectServiceButton';

const { Text } = Typography;

const imageStyle: React.CSSProperties = {
	borderRadius: '6px',
	border: '1px solid #d9d9d9',
	padding: '4px',
	boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
};

const AutomationTable = () => {
	const { t } = useTranslation();
	const [inputString, setInputString] = useState<string>('');
	const [messageApi, contextHolder] = message.useMessage();
	const { authorizeService } = useAuthStore((state) => state);
	const { automationWithDetails, deleteAutomation, fetchDetailedAutomations, updateAutomation } = useAutomationStore(
		(state) => state,
	);
	const [displayAutomations, setDisplayAutomations] = useState<DetailedAutomationDTO[]>([]);

	useEffect(() => {
		try {
			fetchDetailedAutomations().then((automations) => {
				const automationsWithKeys = automations.map((automation) => ({
					...automation,
					key: automation.id,
				}));
				setDisplayAutomations(automationsWithKeys);
			});
		} catch (error: any) {
			console.error('Error fetching automations', error);
			messageApi.open({
				type: 'error',
				content: error.response.data.detail || 'Something went wrong',
			});
		}
	}, []);

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInputString(event.target.value);
		let filteredAutomations = automationWithDetails;
		if (event.target.value !== '') {
			filteredAutomations = automationWithDetails.filter((automation) => {
				return automation.name.toLowerCase().includes(event.target.value.toLowerCase());
			});
		}
		const filteredAutomationsWithKeys = filteredAutomations.map((automation) => ({
			...automation,
			key: automation.id,
		}));
		setDisplayAutomations(filteredAutomationsWithKeys);
	};

	const handleFetchingAutomations = () => {
		try {
			fetchDetailedAutomations().then((automations) => {
				const automationsWithKeys = automations.map((automation) => ({
					...automation,
					key: automation.id,
				}));
				setDisplayAutomations(automationsWithKeys);
			});
		} catch (error: any) {
			console.error('Error fetching automations', error);
			messageApi.open({
				type: 'error',
				content: error.response.data.detail || 'Something went wrong',
			});
		}
	};

	const calculateTimeAgo = (timestamp: string) => {
		const parsedTimestamp = parseISO(timestamp);
		return formatDistanceToNow(parsedTimestamp, { addSuffix: true });
	};

	const updateAutomationStatus = (record: DetailedAutomationDTO, checked: boolean): AutomationCreationDTO => {
		return {
			user_id: record.user_id,
			name: record.name,
			trigger_id: record.trigger_id,
			action_id: record.action_id,
			status: checked ? AutomationStatus.ENABLED : AutomationStatus.DISABLED,
		};
	};

	const googleServices = ['calendar', 'drive', 'gmail', 'youtube'];

	const getGoogleServiceName = (service: string) => {
		const isGoogleService = service.toLowerCase().startsWith('google');
		if (isGoogleService) {
			return service.split(' ')[1];
		}
		return service.toLowerCase();
	};

	const handleConnectService = (service: string) => {
		const googleServiceName = getGoogleServiceName(service);

		if (googleServices.includes(googleServiceName)) {
			console.log('googleServiceName', googleServiceName);
			authorizeService('google', googleServiceName);
		} else if (service == 'spotify') {
			authorizeService('spotify', 'spotify');
		} else if (service == 'github') {
			authorizeService('github', 'github');
		}
	};

	const columns: ColumnsType<DetailedAutomationDTO> = [
		{
			title: t('dashboard.service'),
			key: 'service',
			dataIndex: 'service',
			render: (_, record: DetailedAutomationDTO) => {
				return (
					<Space size="middle">
						<Space style={imageStyle}>
							<Image
								width={24}
								src={`data:image/svg+xml;base64,${record.trigger_service.icon_svg_base64}`}
								preview={false}
							/>
						</Space>
						<Space style={imageStyle}>
							<Image
								width={24}
								src={`data:image/svg+xml;base64,${record.action_service.icon_svg_base64}`}
								preview={false}
							/>
						</Space>
					</Space>
				);
			},
		},
		{
			title: t('dashboard.name'),
			dataIndex: 'name',
			key: 'name',
			render: (_, record: DetailedAutomationDTO) => {
				return (
					<Space size="middle">
						<Text italic>{record.name === '' ? 'Unnamed Automation' : record.name}</Text>
					</Space>
				);
			},
		},
		{
			title: t('dashboard.authorized'),
			dataIndex: 'lastPolled',
			key: 'lastPolled',
			render: (_, record: DetailedAutomationDTO) => {
				return (
					<Space size="middle">
						<ConnectServiceButton
							service={record.trigger_service}
							connected={record.trigger_service.is_authorized}
							onClick={handleConnectService}
						/>
						<ConnectServiceButton
							service={record.action_service}
							connected={record.action_service.is_authorized}
							onClick={handleConnectService}
						/>
					</Space>
				);
			},
		},
		{
			title: t('dashboard.polled'),
			dataIndex: 'lastPolled',
			key: 'lastPolled',
			render: (_, record: DetailedAutomationDTO) => {
				return <Text>{record.last_polled ? calculateTimeAgo(record.last_polled) : 'Never'}</Text>;
			},
		},
		{
			title: t('dashboard.created'),
			dataIndex: 'created_at',
			key: 'created_at',
			render: (_, record: DetailedAutomationDTO) => {
				return <Text>{record.created_at ? calculateTimeAgo(record.created_at) : 'Never'}</Text>;
			},
		},
		{
			title: t('dashboard.delete'),
			key: 'operation',
			dataIndex: 'operation',
			width: 100,
			render: (_, record) => (
				<Popconfirm
					title={t('dashboard.confirm')}
					icon={<ExclamationCircleTwoTone twoToneColor="red" />}
					onConfirm={() => {
						deleteAutomation(record.id)
							.then(handleFetchingAutomations)
							.catch((error) => {
								console.error('Error deleting automation:', error);
								messageApi.open({
									type: 'error',
									content: error.response.data.detail || 'Something went wrong',
								});
							});
					}}
				>
					<DeleteTwoTone style={{ fontSize: '20px', color: 'red' }} twoToneColor="red" />
				</Popconfirm>
			),
		},
		{
			title: t('dashboard.running'),
			dataIndex: 'running',
			key: 'running',
			width: 100,
			render: (_, record: DetailedAutomationDTO) => {
				return (
					<>
						<style>
							{`
                    .switch-checked {
                        background-color: #00C247 !important;
                    }
                    .switch-unchecked {
                        background-color: #B60000 !important;
                    }
							`}
						</style>
						<Switch
							checkedChildren={t('settings.enabled')}
							unCheckedChildren={t('settings.disabled')}
							checked={record.status === AutomationStatus.ENABLED}
							style={{
								fontSize: '20px',
								fontWeight: 'bold',
							}}
							onChange={(checked) => {
								const automationWithUpdatedStatus = updateAutomationStatus(record, checked);
								updateAutomation(record.id, automationWithUpdatedStatus)
									.then(handleFetchingAutomations)
									.catch((error) => {
										console.error('Error deleting automation:', error);
										messageApi.open({
											type: 'error',
											content: error.response.data.detail || 'Something went wrong',
										});
									});
							}}
							className={record.status === AutomationStatus.ENABLED ? 'switch-checked' : 'switch-unchecked'}
						/>
					</>
				);
			},
		},
	];

	return (
		<>
			{contextHolder}
			<div style={{ padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '6px' }}>
				<Row align="middle">
					<Col style={{ marginRight: '8px' }}>
						<InfoCircleTwoTone />
					</Col>
					<Col>
						<Text>{t('dashboard.makeSure')}</Text>
					</Col>
				</Row>
			</div>
			<div
				style={{
					width: '100%',
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center',
					gap: '12px',
				}}
			>
				<Search
					defaultValue="Combine input and button"
					size="large"
					onChange={handleInputChange}
					value={inputString}
					placeholder={t('dashboard.filter')}
					allowClear
				/>
				<Button
					shape="circle"
					icon={<ReloadOutlined />}
					size="large"
					onClick={() => {
						fetchDetailedAutomations().then((automations) => {
							const automationsWithKeys = automations.map((automation) => ({
								...automation,
								key: automation.id,
							}));
							setDisplayAutomations(automationsWithKeys);
						});
					}}
				/>
			</div>
			{displayAutomations !== null ? (
				<Table
					locale={{ emptyText: 'No Current Automations' }}
					columns={columns}
					dataSource={displayAutomations}
					style={{ width: '100%' }}
				/>
			) : null}
		</>
	);
};

export default AutomationTable;
