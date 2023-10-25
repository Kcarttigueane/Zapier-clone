import { Button, Spin, Steps, Typography, message, theme } from 'antd';
import { TFunction } from 'i18next';
import { useState } from 'react';
// import { useCookies } from 'react-cookie';
import { useTranslation } from 'react-i18next';

import { ServiceModelDTO } from '../../../../core/models/service';
import useServicesStore from '../../../../core/zustand/useServiceStore';
import useTriggerStore from '../../../../core/zustand/useTriggerStore';
import ChooseService from './ChooseService';

const { Text } = Typography;

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

const AutomationCreation = () => {
	const { t } = useTranslation();
	const [selectedService1, setSelectedService1] = useState<ServiceModelDTO['id'] | null>(null);
	const [selectedService2, setSelectedService2] = useState<ServiceModelDTO['id'] | null>(null);

	const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
	const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
	const [messageApi, contextHolder] = message.useMessage();
	const { services, isLoading, fetchCompatibleServices, compatibleServices } = useServicesStore((state) => state);
	const { fetchTriggersByService } = useTriggerStore((state) => state);

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
						selectedServiceId={selectedService1}
						setSelectedServiceId={setSelectedService1}
					/>
				);
			case 1:
				if (selectedService1) {
					return (
						<ChooseService
							title={steps[stepIndex].title}
							services={compatibleServices}
							selectedServiceId={selectedService2}
							setSelectedServiceId={setSelectedService2}
						/>
					);
				}
				throw new Error('You must select a service first');
			case 2:
				return <Spin />;
			case 3:
				return <Spin />;
			default:
				return null;
		}
	};

	const { token } = theme.useToken();
	const [current, setCurrent] = useState(0);

	const next = () => {
		switch (current) {
			case 0:
				if (selectedService1) {
					fetchCompatibleServices(selectedService1)
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
				if (selectedService2) {
					fetchTriggersByService(selectedService2)
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
				if (selectedTrigger) {
					setCurrent((prevCurrent) => prevCurrent + 1);
					// TODO : ❌ fetch reaction compatible with selectedService1 and selectedService2
				}
				break;
			case 3:
				if (selectedReaction) {
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
				<Steps
					current={current}
					items={items}
					size="small"
					style={{ width: '80%' }}
					percent={current === 0 ? 25 : current === 1 ? 50 : current === 2 ? 75 : 100}
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
								message.success('Processing complete!');
								// TODO : createAutomation(); ❌
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
								(current == 0 && !selectedService1) ||
								(current == 1 && !selectedService2) ||
								(current == 2 && !selectedTrigger) ||
								(current == 3 && !selectedReaction)
							}
							loading={isLoading}
						>
							Next
						</Button>
					)}
				</div>
			</>
			{/* <ServicesSelection
				selectedService1={selectedService1}
				setSelectedService1={setSelectedService1}
				selectedService2={selectedService2}
				setSelectedService2={setSelectedService2}
			/> */}
			{/* {selectedService1 && selectedService2 ? (
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
			) : null} */}
			{/* {selectedTrigger &&
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
			{/* <FloatButton
				onClick={() => console.log('click')}
				style={{ width: 60, height: 60 }}
				shape="circle"
				type="primary"
				icon={<PlusCircleOutlined />}
			/> */}
		</>
	);
};

export default AutomationCreation;
