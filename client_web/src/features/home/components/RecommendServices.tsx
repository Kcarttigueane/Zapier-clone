import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

const imageStyle: React.CSSProperties = {
	borderRadius: '12px',
	border: '1px solid #d9d9d9',
	padding: '24px',
	boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
};

const RecommendServices = () => {
	const { t } = useTranslation();

	return (
		<>
			{/* <Title level={4}>{t('home.recommendedSection.serviceTitle')}</Title>
			<Col
				style={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: '30px',
					justifyContent: 'center',
					backgroundColor: '#fff',
				}}
			>
				{isLoading
					? Array.from({ length: 9 }).map((_, index) => (
							<Space size={48} style={{ borderRadius: 12 }} key={index}>
								<Skeleton.Image active={true} />
							</Space>
					  ))
					: services.map((service: ServiceModelDTO) => {
							return (
								<Space style={imageStyle} key={service.id}>
									<Image width={48} src={`data:image/svg+xml;base64,${service.icon_svg_base64}`} preview={false} />
								</Space>
							);
					  })}
			</Col> */}
		</>
	);
};

export default RecommendServices;
