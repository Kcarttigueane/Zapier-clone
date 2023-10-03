import { AppstoreFilled, QuestionCircleFilled, SettingFilled } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps, MenuTheme } from 'antd/es/menu';
import React, { useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number];

interface SettingsMenuProps {
	onSelect: (key: string) => void;
}

function getItem(
	label: React.ReactNode,
	key?: React.Key | null,
	icon?: React.ReactNode,
	children?: MenuItem[],
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
	} as MenuItem;
}

const items: MenuItem[] = [
	getItem('General Settings', '1', <SettingFilled />),
	getItem('Connected Services', '2', <AppstoreFilled />),
	getItem('Help & Support', '3', <QuestionCircleFilled />),
];

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onSelect }) => {
	const [theme, setTheme] = useState<MenuTheme>('light');

	const changeTheme = (value: boolean) => {
		setTheme(value ? 'dark' : 'light');
	};

	return (
		<Menu
			style={{ width: 256, fontWeight: 600 }}
			defaultSelectedKeys={['1']}
			defaultOpenKeys={['sub1']}
			theme={theme}
			items={items}
			onSelect={({ key }) => onSelect(key)}
		/>
	);
};

export default SettingsMenu;
