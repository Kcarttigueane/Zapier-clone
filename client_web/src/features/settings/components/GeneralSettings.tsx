import { Input, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { UserModelDTO } from '../../../core/models/user';
import useUserStore from '../../../core/zustand/useUserStore';
import SettingItem from './SettingItem';
import UploadNewImage from './UploadNewImage';

const containerStyle: React.CSSProperties = {
	border: '1px solid #d9d9d9',
	padding: '60px 140px',
	borderRadius: '12px',
};

const GeneralSettings = () => {
	const { t } = useTranslation();
	const { user, updateUser } = useUserStore((state) => state);

	const changeTheme = () => {
		if (user === null) {
			return;
		}
		const currentTheme = user?.profile.theme;
		const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
		const updatedUser: Partial<UserModelDTO> = {
			...user,
		};
		user.profile.theme = newTheme as 'dark' | 'light' | 'system';
		user.profile.language = user.profile.language || 'default';
		updateUser(updatedUser);
	};

	return (
		<Space direction="vertical" size={32} style={containerStyle} align="start">
			<SettingItem label={t('settings.settingScreen.profile.pic')}>
				<UploadNewImage />
			</SettingItem>
			<SettingItem label={t('settings.settingScreen.profile.name')}>
				<Input placeholder={user?.profile.first_name} size="large" style={{ width: '337px' }} disabled />
			</SettingItem>
			<SettingItem label={t('settings.settingScreen.profile.email')}>
				<Input placeholder={user?.profile.last_name} size="large" style={{ width: '337px' }} disabled />
			</SettingItem>
			<SettingItem label={t('settings.settingScreen.profile.pushNotif')} switchable defaultChecked />
			<SettingItem label={t('settings.settingScreen.profile.emailNotif')} switchable defaultChecked />
			<SettingItem
				label={t('settings.settingScreen.profile.mode')}
				switchable
				defaultChecked={user?.profile.theme === 'dark'}
				onToggleChange={changeTheme}
			/>
		</Space>
	);
};

export default GeneralSettings;
