import { NodeCollapseOutlined, NodeExpandOutlined, WifiOutlined } from '@ant-design/icons';
import { Col, Collapse, Divider, Image, Layout, Row, Skeleton, Space, Typography, message, theme } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiV2 } from '../../../core/api';
import CustomNavBar from '../../../core/components/CustomNavBar';
import CustomServiceDetailList from '../../home/components/CustomServiceDetailList';

const { Title, Text } = Typography;

const imageStyle: React.CSSProperties = {
	borderRadius: '8px',
	padding: '4px',
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'center',
	alignItems: 'center',
};

const contentStyle: React.CSSProperties = {
	padding: '48px 24px',
	display: 'flex',
	flexDirection: 'column',
	gap: '24px',
	alignItems: 'center',
};

const About = () => {
	const { t } = useTranslation();
	const { token } = theme.useToken();
	const [messageApi, contextHolder] = message.useMessage();

	const [aboutData, setAboutData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAboutData = async () => {
			try {
				const response = await apiV2.get('/about.json');
				setAboutData(response.data);
			} catch (error) {
				console.error('Error fetching about data:', error);
				message.error('Error fetching about data');
			} finally {
				setLoading(false);
			}
		};

		fetchAboutData();
	}, []);

	if (loading) {
		return <Skeleton active />;
	}

	const layoutStyle: React.CSSProperties = {
		minHeight: '100vh',
		backgroundColor: token.colorBgBase,
	};

	const footerStyle: React.CSSProperties = {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.1)',
		backgroundColor: token.colorBgElevated,
	};

	const cardStyle: React.CSSProperties = {
		borderRadius: '12px',
		border: '1px solid #d9d9d9',
		padding: '20px',
		boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
		transition: 'transform 0.2s ease-in-out',
		backgroundColor: token.colorBgElevated,
		height: '120px',
		width: '24%',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '16px',
		borderColor: '#1890ff',
	};

	return (
		<>
			<Layout style={layoutStyle}>
				<CustomNavBar />
				<Content style={contentStyle}>
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
						About
					</Title>
					<Row
						style={{
							width: '80%',
							display: 'flex',
							justifyContent: 'space-evenly',
							gap: '12px',
						}}
					>
						<Space direction="vertical" style={cardStyle}>
							<WifiOutlined size={24} color="#1890ff" style={{ fontSize: '24px', color: '#1890ff' }} />
							<Text strong> {aboutData?.client?.host ?? 'No host'}</Text>
						</Space>
						<Space direction="vertical" style={cardStyle}>
							<NodeExpandOutlined size={24} color="#1890ff" style={{ fontSize: '24px', color: '#1890ff' }} />
							<Text strong>{aboutData?.client?.services ?? 'No host'}</Text>
						</Space>
						<Space direction="vertical" style={cardStyle}>
							<NodeCollapseOutlined size={24} color="#1890ff" style={{ fontSize: '24px', color: '#1890ff' }} />
							<Text strong>Nb Triggers {aboutData?.client?.triggers ?? 'No host'}</Text>
						</Space>
						<Space direction="vertical" style={cardStyle}>
							<WifiOutlined size={24} color="#1890ff" style={{ fontSize: '24px', color: '#1890ff' }} />
							<Text strong>Nb Reactions {aboutData?.client?.actions ?? 'No host'}</Text>
						</Space>
					</Row>
					<Col
						style={{
							display: 'flex',
							width: '80%',
							gap: '24px',
							flexWrap: 'wrap',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						{aboutData?.server?.services.map((service) => (
							<Collapse key={service.name} bordered style={{ width: '100%' }}>
								<Collapse.Panel
									key={service.name}
									header={
										<Space style={imageStyle}>
											{/* Assuming the service icons are SVGs stored as base64 strings */}
											<Image
												width={24}
												src={`data:image/svg+xml;base64,${service.icon_svg_base64}`}
												preview={false}
											/>{' '}
											<Title level={5}>{service.name}</Title>
										</Space>
									}
								>
									<Text>{service.description}</Text>
									<Divider style={{ margin: '12px 0' }} />
									<Row
										style={{
											width: '100%',
											display: 'flex',
											justifyContent: 'space-around',
											gap: '12px',
										}}
									>
										{/* Assuming CustomServiceDetailList is a component you have defined */}
										<CustomServiceDetailList title="Actions" items={service.actions} borderLeftColor="#1890ff" />
										<CustomServiceDetailList title="Reactions" items={service.reactions} borderLeftColor="#52c41a" />
									</Row>
								</Collapse.Panel>
							</Collapse>
						))}
					</Col>
				</Content>
				<Footer style={footerStyle}>Area ©2023 Created by AREA EPITECH</Footer>
			</Layout>
		</>
	);
};

export default About;
