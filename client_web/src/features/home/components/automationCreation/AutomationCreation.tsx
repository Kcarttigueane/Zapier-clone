import { Button, Input, Steps, Typography, message, theme } from 'antd';
import { useState } from 'react';
// import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

import { GatewayOutlined } from '@ant-design/icons';
import { ActionModelDTO } from '../../../../core/models/action';
import { AutomationCreationDTO } from '../../../../core/models/automation';
import { ServiceModelDTO } from '../../../../core/models/service';
import { TriggerModelDTO } from '../../../../core/models/trigger';
import useActionStore from '../../../../core/zustand/useActionStore';
import useAutomationStore from '../../../../core/zustand/useAutomation';
import useServicesStore from '../../../../core/zustand/useServiceStore';
import useTriggerStore from '../../../../core/zustand/useTriggerStore';
import ChooseAction from './ChooseAction';
import ChooseService from './ChooseService';
import ChooseTrigger from './ChooseTrigger';

const { Title } = Typography;

const AutomationCreation = () => {
	const { t } = useTranslation();
	const [selectedTriggerService1, setSelectedTriggerService1] = useState<ServiceModelDTO['id'] | null>(null);
	const [selectedActionService2, setSelectedService2] = useState<ServiceModelDTO['id'] | null>(null);
	const [selectedTriggerId, setSelectedTriggerId] = useState<TriggerModelDTO['id'] | null>(null);
	const [selectedActionId, setSelectedActionId] = useState<ActionModelDTO['id'] | null>(null);

	const [automationName, setAutomationName] = useState<string>('');

	const [messageApi, contextHolder] = message.useMessage();

	const { services, isLoading, fetchCompatibleServices, compatibleServices } = useServicesStore((state) => state);
	const { fetchTriggersByService, triggersAssociatedToService } = useTriggerStore((state) => state);
	const { fetchActionsByTriggerId, actionsAssociatedToTrigger } = useActionStore((state) => state);
	const { createAutomation } = useAutomationStore((state) => state);

	const steps = [
		{
			title: t('home.create.action1'),
			content: 'Choose your first service',
		},
		{
			title: t('home.create.reaction1'),
			content: 'Choose your second service',
		},
		{
			title: t('home.create.action2'),
			content: 'Choose your trigger',
		},
		{
			title: t('home.create.reaction2'),
			content: 'Choose your reaction',
		},
	];

	const renderStepContent = (stepIndex: number) => {
		switch (stepIndex) {
			case 0:
				return (
					<ChooseService
						title={steps[stepIndex].title}
						services={services}
						selectedServiceId={selectedTriggerService1}
						setSelectedServiceId={setSelectedTriggerService1}
					/>
				);
			case 1:
				if (selectedTriggerService1) {
					return (
						<ChooseService
							title={steps[stepIndex].title}
							services={compatibleServices}
							selectedServiceId={selectedActionService2}
							setSelectedServiceId={setSelectedService2}
						/>
					);
				}
				throw new Error('You must select a service first');
			case 2:
				if (selectedActionService2) {
					return (
						<ChooseTrigger
							triggers={triggersAssociatedToService}
							selectedTriggerId={selectedTriggerId}
							setSelectedTriggerId={setSelectedTriggerId}
						/>
					);
				}
				throw new Error('You must select a service first');
			case 3:
				if (selectedTriggerId) {
					return (
						<ChooseAction
							actions={actionsAssociatedToTrigger}
							selectedActionId={selectedActionId}
							setSelectedActionId={setSelectedActionId}
						/>
					);
				}
				throw new Error('You must select a service first');
			default:
				return null;
		}
	};

	const { token } = theme.useToken();
	const [current, setCurrent] = useState(0);

	const next = () => {
		switch (current) {
			case 0:
				if (selectedTriggerService1) {
					fetchCompatibleServices(selectedTriggerService1)
						.then(() => setCurrent((prevCurrent) => prevCurrent + 1))
						.catch((error) => {
							console.error('Error fetching compatible services:', error);
							messageApi.open({
								type: 'error',
								content: error.response.data.detail || 'Something went wrong',
							});
						});
				}
				break;
			case 1:
				if (selectedTriggerService1) {
					console.log('selectedTriggerService1', selectedTriggerService1);
					fetchTriggersByService(selectedTriggerService1)
						.then(() => setCurrent((prevCurrent) => prevCurrent + 1))
						.catch((error: any) => {
							console.error('Error fetching compatible services:', error);
							messageApi.open({
								type: 'error',
								content: error.response.data.detail || 'Something went wrong',
							});
						});
				}
				break;
			case 2:
				if (selectedActionService2 && selectedTriggerId) {
					fetchActionsByTriggerId(selectedActionService2, selectedTriggerId)
						.then(() => setCurrent((prevCurrent) => prevCurrent + 1))
						.catch((error) => {
							console.error('Error fetching compatible services:', error);
							messageApi.open({
								type: 'error',
								content: error.response.data.detail || 'Something went wrong',
							});
						});
				}
				break;
			case 3:
				if (selectedActionId) {
					setCurrent((prevCurrent) => prevCurrent + 1);
				}
				break;
			default:
				break;
		}
	};
	const prev = () => setCurrent((prevCurrent) => prevCurrent - 1);

	const items = steps.map((item) => ({ key: item.title, title: item.title }));

	const contentStyle: React.CSSProperties = {
		color: token.colorTextTertiary,
		backgroundColor: token.colorFillAlter,
		borderRadius: token.borderRadiusLG,
		border: `1px dashed ${token.colorBorder}`,
		width: '80%',
		display: 'flex',
		flexDirection: 'column',
		gap: '24px',
		alignItems: 'center',
		justifyContent: 'center',
		padding: '48px 24px',
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
			<>
				<Title level={4}>{t('home.create.title')}</Title>
				<Steps
					current={current}
					items={items}
					size="small"
					style={{ width: '80%' }}
					percent={current === 0 ? 25 : current === 1 ? 50 : current === 2 ? 75 : 100}
				/>
				<Input
					style={{ width: '80%' }}
					size="large"
					placeholder="Name of the automation"
					prefix={<GatewayOutlined style={{ marginRight: 8 }} />}
					id="AutomationName"
					name="AutomationName"
					value={automationName}
					onChange={(e) => setAutomationName(e.target.value)}
				/>
				<div style={contentStyle}>{renderStepContent(current)}</div>

				<div style={{ marginTop: 24 }}>
					{current > 0 && (
						<Button style={{ margin: '0 8px' }} onClick={() => prev()}>
							Previous
						</Button>
					)}
					{current === steps.length - 1 && (
						<Button
							type="primary"
							onClick={() => {
								if (!selectedTriggerId || !selectedActionId) {
									message.error('Please select a trigger and an action');
									return;
								}
								message.success('Processing complete!');
								const automation: AutomationCreationDTO = {
									userId: '1',
									name: 'AutomationName',
									triggerId: selectedTriggerId,
									actionId: selectedActionId,
									status: 'disabled',
								};
								createAutomation(automation);
							}}
						>
							Done
						</Button>
					)}
					{current < steps.length - 1 && (
						<Button
							type="primary"
							onClick={() => next()}
							disabled={
								(current == 0 && !selectedTriggerService1) ||
								(current == 1 && !selectedActionService2) ||
								(current == 2 && !selectedTriggerId) ||
								(current == 3 && !selectedActionId)
							}
							loading={isLoading}
						>
							Next
						</Button>
					)}
				</div>
			</>
			{/* <ServicesSelection
			) : null}
			{selectedTriggerId && selectedReaction ? (
			) : null} */}
			{/* <Button
					style={{
						alignItems: 'center',
						width: '200px',
						height: '50px',
						borderRadius: '50px',
						fontSize: serviceConnected1 && serviceConnected2 ? '20px' : '14px',
						fontWeight: 'bold',
					}}
					// onClick={createAutomation}
				>
					{t('home.create.title')}
				</Button> */}
		</>
	);
};

export default AutomationCreation;
