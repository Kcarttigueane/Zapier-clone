import { Col, Image, Popover, Space, Spin, Typography, theme } from 'antd';
import { FC, useState } from 'react';
import { ServiceModelDTO } from '../../../../core/models/service';
import { capitalizeFirstLetter } from '../../../../core/utils/capitalizeFirstLetter';
import useServicesStore from '../../../../core/zustand/useServiceStore';

const { Text } = Typography;

interface ChooseServiceProps {
	title: string;
	services: ServiceModelDTO[];
	selectedServiceId: ServiceModelDTO['id'] | null;
	setSelectedServiceId: (id: ServiceModelDTO['id']) => void;
}

const ChooseService: FC<ChooseServiceProps> = ({ title, services, selectedServiceId, setSelectedServiceId }) => {
	const [hovered, setHovered] = useState<string | null>(null);
	const { token } = theme.useToken();

	const { isLoading } = useServicesStore((state) => state);

	const imageStyle: React.CSSProperties = {
		borderRadius: '12px',
		border: '1px solid #d9d9d9',
		padding: '20px',
		boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
		transition: 'transform 0.2s ease-in-out',
		backgroundColor: token.colorBgElevated,
		height: '120px',
		minWidth: '120px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '16px',
	};

	const hoverStyle: React.CSSProperties = {
		transform: 'scale(1.05)',
	};

	return (
		<>
			<Text style={{ fontSize: '14px', fontWeight: 'bold' }}>{title}</Text>
			<Col
				style={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: '36px',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{isLoading ? (
					<Spin />
				) : (
					services.map((service: ServiceModelDTO) => {
						const isSelected = service.id === selectedServiceId;
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
									key={service.id}
									direction="vertical"
									style={{
										...imageStyle,
										...(hovered === service.id && hoverStyle),
										borderColor: isSelected ? '#1890ff' : '#d9d9d9',
										borderWidth: isSelected ? '2px' : '1px',
									}}
									onMouseEnter={() => setHovered(service.id)}
									onMouseLeave={() => setHovered(null)}
									onClick={() => {
										setSelectedServiceId(service.id);
									}}
								>
									<Image width={48} src={`data:image/svg+xml;base64,${service.icon_svg_base64}`} preview={false} />
									<Text>{capitalizeFirstLetter(service.name)}</Text>
								</Space>
							</Popover>
						);
					})
				)}
			</Col>
		</>
	);
};

export default ChooseService;
