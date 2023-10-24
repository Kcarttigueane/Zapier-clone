import { Col, Image, Modal, Popover, Skeleton, Space, Typography } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceModelDTO } from '../../../core/models/service';
import useServicesStore from '../../../core/zustand/useServiceStore';

const { Title } = Typography;

const imageStyle: React.CSSProperties = {
	borderRadius: '12px',
	border: '1px solid #d9d9d9',
	padding: '20px',
	boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
	transition: 'transform 0.2s ease-in-out',
	marginTop: '12px',
};

const RecommendServices = () => {
	const { t } = useTranslation();
	const { services, isLoading } = useServicesStore((state) => state);
	const [selectedService, setSelectedService] = useState<ServiceModelDTO | null>(null);
	const [modal2Open, setModal2Open] = useState(false);

	const capitalizeFirstLetter = (name: string) => {
		return name.charAt(0).toUpperCase() + name.slice(1);
	};

	return (
		<>
			<style>
				{`
				.ant-popover .ant-popover-title {
					margin-bottom: 0;
					min-width: 100%;
				}
        	`}
			</style>
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
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: '36px',
					justifyContent: 'center',
					backgroundColor: '#fff',
				}}
			>
				{isLoading
					? Array.from({ length: 9 }).map((_, index) => (
							<Space size={12} style={{ borderRadius: 16 }} key={index}>
								<Skeleton.Image active={true} />
							</Space>
					  ))
					: services.map((service: ServiceModelDTO) => {
							return (
								<Popover
									title={capitalizeFirstLetter(service.name)}
									key={service.id}
									placement="bottom"
									style={{
										textAlign: 'center',
										flexDirection: 'column',
										alignItems: 'center',
										alignContent: 'center',
									}}
								>
									<Space
										style={imageStyle}
										key={service.id}
										onClick={() => {
											setModal2Open(true);
											setSelectedService(service);
										}}
									>
										<Image width={48} src={`data:image/svg+xml;base64,${service.icon_svg_base64}`} preview={false} />
									</Space>
								</Popover>
							);
					  })}
			</Col>
			<Modal
				title={selectedService ? capitalizeFirstLetter(selectedService.name) : ''}
				centered
				open={modal2Open}
				onOk={() => setModal2Open(false)}
				onCancel={() => setModal2Open(false)}
			>
				<p>{selectedService ? selectedService.description : ''}</p>
			</Modal>
		</>
	);
};

export default RecommendServices;
