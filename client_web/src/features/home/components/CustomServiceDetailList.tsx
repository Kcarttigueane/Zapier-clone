import { Col, List, Space, Typography } from 'antd';
import { FC } from 'react';
import { ActionModelDTO } from '../../../core/models/action';
import { TriggerModelDTO } from '../../../core/models/trigger';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

interface CustomServiceDetailListProps {
	title: string;
	items: TriggerModelDTO[] | ActionModelDTO[];
	borderLeftColor: string;
}

const itemsStyle: React.CSSProperties = {
	marginTop: '16px',
	borderRadius: '12px',
	border: '1px solid #d9d9d9',
	padding: '12px',
	boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
	transition: 'transform 0.2s ease-in-out',
	backgroundColor: '#fff',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
};

const CustomServiceDetailList: FC<CustomServiceDetailListProps> = ({ title, items, borderLeftColor }) => {
	const { t } = useTranslation();
	return (
	<Col
		style={{
			width: '45%',
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
		}}
	>
		<Text strong>{title}</Text>
		<List
			style={{ width: '100%' }}
			dataSource={items}
			renderItem={(item) => (
				<Space key={item.id} direction="vertical" style={{ ...itemsStyle, borderLeft: `4px solid ${borderLeftColor}` }}>
					<Text strong>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
					<Text>{t(item.description)}</Text>
				</Space>
			)}
		/>
	</Col>
)};

export default CustomServiceDetailList;
