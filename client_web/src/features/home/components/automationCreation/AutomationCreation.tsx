import { Button, Input, Steps, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { GatewayOutlined } from '@ant-design/icons';
import useAutomationCreationLogic from '../../hooks/useAutomationCreationLogic';
import ChooseAction from './ChooseAction';
import ChooseService from './ChooseService';
import ChooseTrigger from './ChooseTrigger';

const { Title } = Typography;

const AutomationCreation = () => {
	const { t } = useTranslation();
	const {
		services,
		selectedTriggerService1,
		setSelectedTriggerService1,
		selectedActionService2,
		setSelectedService2,
		selectedTriggerId,
		setSelectedTriggerId,
		selectedActionId,
		setSelectedActionId,
		automationName,
		setAutomationName,
		selectedTriggerServiceName,
		setSelectedTriggerServiceName,
		selectedActionServiceName,
		setSelectedActionServiceName,
		selectedTriggerName,
		setSelectedTriggerName,
		isLoading,
		compatibleServices,
		triggersAssociatedToService,
		actionsAssociatedToTrigger,
		current,
		setCurrent,
		next,
		prev,
		onCreateAutomationClick,
		isAutomationsLoading,
	} = useAutomationCreationLogic();
	const { token } = theme.useToken();

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
						setSelectedServiceName={setSelectedTriggerServiceName}
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
							setSelectedServiceName={setSelectedActionServiceName}
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
							setSelectedTriggerName={setSelectedTriggerName}
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
							selectedTriggerName={selectedTriggerName}
							automationName={automationName}
							setAutomationName={setAutomationName}
							selectedTriggerServiceName={selectedTriggerServiceName}
							selectedActionServiceName={selectedActionServiceName}
						/>
					);
				}
				throw new Error('You must select a service first');
			default:
				return null;
		}
	};

	const stepperItems = steps.map((item) => ({ key: item.title, title: item.title }));

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
			<>
				<Title level={4}>{t('home.create.title')}</Title>
				<Steps
					current={current}
					items={stepperItems}
					size="small"
					style={{ width: '80%' }}
					percent={current === 0 ? 25 : current === 1 ? 50 : current === 2 ? 75 : 100}
				/>
				<Input
					style={{ width: '80%' }}
					size="large"
					placeholder={t('home.create.name')}
					prefix={<GatewayOutlined style={{ marginRight: 8 }} />}
					id="AutomationName"
					name="AutomationName"
					value={automationName}
					onChange={(e) => {
						setAutomationName(e.target.value); // ! Need to check because potential bug when creating two automations in a row
						console.log('automationName', automationName);
					}}
					status={automationName.trim() === '' ? (current === steps.length - 1 ? 'error' : 'warning') : ''}
				/>
				<div style={contentStyle}>{renderStepContent(current)}</div>

				<div style={{ marginTop: 24 }}>
					{current === steps.length - 1 && (
						<Button
							type="dashed"
							style={{ margin: '0 8px' }}
							onClick={() => {
								setSelectedTriggerService1(null);
								setCurrent(0);
								setAutomationName('');
							}}
						>
							{t('basic.actions.reset')}
						</Button>
					)}
					{current > 0 && (
						<Button style={{ margin: '0 8px' }} onClick={() => prev()}>
							{t('basic.actions.previous')}
						</Button>
					)}
					{current === steps.length - 1 && (
						<Button
							type="primary"
							onClick={onCreateAutomationClick}
							loading={isAutomationsLoading}
							disabled={automationName == ''}
						>
							{t('basic.actions.finish')}
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
							{t('basic.actions.next')}
						</Button>
					)}
				</div>
			</>
		</>
	);
};

export default AutomationCreation;
