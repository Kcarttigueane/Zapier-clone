import { AppstoreFilled, QuestionCircleFilled, SettingFilled } from '@ant-design/icons';
import { Menu } from 'antd';
import type { MenuProps, MenuTheme } from 'antd/es/menu';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

type MenuItem = Required<MenuProps>['items'][number];

interface SettingsMenuProps {
	onSelect: (key: string) => void;
}

const getItem = function (
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
};

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onSelect }) => {
	const [theme] = useState<MenuTheme>('light');

	const { t } = useTranslation();

	const items: MenuItem[] = [
		getItem(t('settings.settingScreen.profile.title'), '1', <SettingFilled />),
		getItem(t('settings.settingScreen.connectedServices.title'), '2', <AppstoreFilled />),
		getItem(t('settings.settingScreen.help.title'), '3', <QuestionCircleFilled />),
	];

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
