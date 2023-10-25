import { Typography } from 'antd';
import { useState } from 'react';
import useServicesStore from '../../../../core/zustand/useServiceStore';

const { Text } = Typography;

const imageStyle: React.CSSProperties = {
	borderRadius: '12px',
	border: '1px solid #d9d9d9',
	padding: '20px',
	boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
	transition: 'transform 0.2s ease-in-out',
	backgroundColor: '#fff',
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

const ChooseTrigger = () => {
	const [hovered, setHovered] = useState<string | null>(null);

	const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
	const { services, fetchCompatibleServices, isLoading, compatibleServices } = useServicesStore((state) => state);

	return (
		// <Space
		// 	key={service.id}
		// 	direction="vertical"
		// 	style={{
		// 		...imageStyle,
		// 		...(hovered === service.id && hoverStyle),
		// 		borderColor: isSelected ? '#1890ff' : '#d9d9d9',
		// 		borderWidth: isSelected ? '2px' : '1px',
		// 	}}
		// 	onMouseEnter={() => setHovered(service.id)}
		// 	onMouseLeave={() => setHovered(null)}
		// 	onClick={() => {
		// 		setSelectedServiceId(service.id);
		// 	}}
		// >
		// 	<Image width={48} src={`data:image/svg+xml;base64,${service.icon_svg_base64}`} preview={false} />
		// 	<Text>{capitalizeFirstLetter(service.name)}</Text>
		// </Space>
	);
};

export default ChooseTrigger;
