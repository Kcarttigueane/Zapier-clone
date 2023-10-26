import { Col, Collapse, Divider, Image, Row, Skeleton, Space, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceModelDTO } from '../../../core/models/service';
import useActionStore from '../../../core/zustand/useActionStore';
import useServicesStore from '../../../core/zustand/useServiceStore';
import useTriggerStore from '../../../core/zustand/useTriggerStore';
import CustomServiceDetailList from './CustomServiceDetailList';

const { Title, Text } = Typography;

const imageStyle: React.CSSProperties = {
	borderRadius: '8px',
	padding: '4px',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
};

const RecommendServices = () => {
	const { t } = useTranslation();
	const [activeKey, setActiveKey] = useState<string | string[]>([]);
	const { services, isLoading } = useServicesStore((state) => state);
	const { triggers, isTriggersLoading, fetchTriggers } = useTriggerStore((state) => state);
	const { actions, isActionsLoading, fetchActions } = useActionStore((state) => state);
	const [messageApi, contextHolder] = message.useMessage();

	useEffect(() => {
		try {
			fetchTriggers();
			fetchActions();
		} catch (error: any) {
			console.error('Error fetching triggers or actions', error);
			messageApi.open({
				type: 'error',
				content: error.response.data.detail || 'Something went wrong',
			});
		}
	}, []);

	const capitalizeFirstLetter = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);

	return (
		<>
			<style>
				{`
					.ant-popover .ant-popover-title {
						margin-bottom: 0;
						min-width: 100%;
					}
					.ant-collapse .ant-collapse-item > .ant-collapse-header {
						align-items: center;
					}
					.ant-collapse .ant-collapse-item:last-child > .ant-collapse-content {
						width: 100%;
					}
				`}
			</style>
			{contextHolder}
			<Title
				level={4}
				style={{
					padding: 0,
					margin: 0,
				}}
			>
				{t('home.recommendedSection.serviceTitle')}
			</Title>
			<Col
				style={{
					display: 'flex',
					width: '60%',
					gap: '24px',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{isLoading || isTriggersLoading || isActionsLoading
					? Array.from({ length: 4 }).map((_, index) => (
							<Space size={12} style={{ borderRadius: 16 }} key={index}>
								<Skeleton.Image active={true} />
							</Space>
					  ))
					: services.map((service: ServiceModelDTO) => {
							const serviceTriggers = triggers.filter((trigger) => trigger.service_id === service.id);
							return (
								<Collapse
									defaultActiveKey={activeKey}
									onChange={(key) => {
										setActiveKey(key);
									}}
									key={service.id}
									bordered
									style={{
										width: '100%',
										display: 'flex',
										flexDirection: 'column',
										justifyContent: 'center',
									}}
									items={[
										{
											style: {
												width: '100%',
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'center',
											},
											key: service.id,
											label: (
												<Space style={imageStyle} key={service.id}>
													<Image
														width={24}
														src={`data:image/svg+xml;base64,${service.icon_svg_base64}`}
														preview={false}
													/>
													<Title
														level={5}
														style={{
															padding: 0,
															margin: 0,
														}}
													>
														{capitalizeFirstLetter(service.name)}
													</Title>
												</Space>
											),
											children: (
												<>
													<Text>{service.description}</Text>
													{isTriggersLoading ? (
														<Skeleton.Image active={true} />
													) : (
														<>
															<Divider style={{ margin: '12px 0' }} />
															<Row
																style={{
																	width: '100%',
																	display: 'flex',
																	justifyContent: 'space-around',
																	gap: '12px',
																}}
															>
																<CustomServiceDetailList
																	title="Triggers"
																	items={serviceTriggers}
																	borderLeftColor="#52c41a"
																/>
																<CustomServiceDetailList title="Actions" items={actions} borderLeftColor="#1890ff" />
															</Row>
														</>
													)}
												</>
											),
										},
									]}
								/>
							);
					  })}
			</Col>
		</>
	);
};

export default RecommendServices;
