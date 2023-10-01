import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Space, Switch } from 'antd';
import React from 'react';

interface SettingItemProps {
	label: string;
	children?: React.ReactNode;
	switchable?: boolean;
	defaultChecked?: boolean;
}

const labelStyle: React.CSSProperties = {
	textAlign: 'center' as React.CSSProperties['textAlign'],
	color: 'black',
	fontSize: 14,
	fontWeight: 600,
	wordWrap: 'break-word',
};

const SettingItem: React.FC<SettingItemProps> = ({ label, children, switchable, defaultChecked }) => {
	return (
		<Space direction="horizontal" size={32}>
			<div style={labelStyle}>{label}</div>
			{children}
			{switchable && (
				<Switch
					checkedChildren={<CheckOutlined />}
					unCheckedChildren={<CloseOutlined />}
					defaultChecked={defaultChecked}
				/>
			)}
		</Space>
	);
};

export default SettingItem;
