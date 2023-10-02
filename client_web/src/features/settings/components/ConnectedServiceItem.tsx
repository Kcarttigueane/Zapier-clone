import { Image, Space, Switch } from 'antd';
import React from 'react';

interface ConnectedServiceItemProps {
	imageUrl: string;
	serviceName: string;
	defaultChecked?: boolean;
}

const cardStyle: React.CSSProperties = {
	width: 400,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	border: '1px solid #d9d9d9',
	borderRadius: '12px',
	padding: '12px 24px',
};

const ConnectedServiceItem: React.FC<ConnectedServiceItemProps> = ({ imageUrl, serviceName, defaultChecked }) => {
	return (
		<Space style={cardStyle}>
			<Image width={32} src={imageUrl} />
			<p style={{ margin: '0 0 0 16px' }}>{serviceName}</p>
			<Switch checkedChildren="Enabled" unCheckedChildren="Disabled" defaultChecked={defaultChecked} />
		</Space>
	);
};

export default ConnectedServiceItem;
