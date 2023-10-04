import { Input, Space } from 'antd';
import PhoneInput from 'antd-phone-input';
import FormItem from 'antd/es/form/FormItem';
import SettingItem from './SettingItem';
import UploadNewImage from './UploadNewImage';
import { useTranslation } from 'react-i18next';

const containerStyle: React.CSSProperties = {
	border: '1px solid #d9d9d9',
	padding: '60px 140px',
	borderRadius: '12px',
};

const GeneralSettings = () => {
	const { t } = useTranslation();
	return (
		<Space direction="vertical" size={32} style={containerStyle}>
			<SettingItem label={t('settings.settingScreen.profile.pic')}>
				<UploadNewImage />
			</SettingItem>
			<SettingItem label={t('settings.settingScreen.profile.name')}>
				<Input placeholder="John Doe" size="large" />
			</SettingItem>
			<SettingItem label={t('settings.settingScreen.profile.email')}>
				<Input placeholder="johndoe@gmail.com" size="large" />
			</SettingItem>
			<SettingItem label={t('settings.settingScreen.profile.phone')}>
				<FormItem name="phone">
					<PhoneInput enableSearch />
				</FormItem>
			</SettingItem>
			<SettingItem label={t('settings.settingScreen.profile.pushNotif')} switchable defaultChecked />
			<SettingItem label={t('settings.settingScreen.profile.emailNotif')} switchable defaultChecked />
			<SettingItem label={t('settings.settingScreen.profile.mode')} switchable defaultChecked />
		</Space>
	);
};

export default GeneralSettings;
