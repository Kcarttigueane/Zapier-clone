import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Space, Switch, theme } from 'antd';
import React from 'react';

interface SettingItemProps {
	label: string;
	children?: React.ReactNode;
	switchable?: boolean;
	defaultChecked?: boolean;
	onToggleChange?: (checked: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({ label, children, switchable, defaultChecked, onToggleChange }) => {
	const { token } = theme.useToken();

	const labelStyle: React.CSSProperties = {
		textAlign: 'center',
		color: token.colorText,
		fontSize: 14,
		fontWeight: 600,
		wordWrap: 'break-word',
	};

	return (
		<Space direction="horizontal" size={32}>
			<div style={labelStyle}>{label}</div>
			{children}
			{switchable && (
				<Switch
					checkedChildren={<CheckOutlined />}
					unCheckedChildren={<CloseOutlined />}
					defaultChecked={defaultChecked}
					onChange={onToggleChange}
				/>
			)}
		</Space>
	);
};

export default SettingItem;
