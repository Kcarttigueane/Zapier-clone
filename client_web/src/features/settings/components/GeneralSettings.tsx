import { Input, Space } from 'antd';
import PhoneInput from 'antd-phone-input';
import FormItem from 'antd/es/form/FormItem';
import SettingItem from './SettingItem';
import UploadNewImage from './UploadNewImage';

const containerStyle: React.CSSProperties = {
	border: '1px solid #d9d9d9',
	padding: '60px 140px',
	borderRadius: '12px',
};

const GeneralSettings = () => {
	return (
		<Space direction="vertical" size={32} style={containerStyle}>
			<SettingItem label="Profile picture">
				<UploadNewImage />
			</SettingItem>
			<SettingItem label="Name">
				<Input placeholder="John Doe" size="large" />
			</SettingItem>
			<SettingItem label="Email">
				<Input placeholder="johndoe@gmail.com" size="large" />
			</SettingItem>
			<SettingItem label="Phone number">
				<FormItem name="phone">
					<PhoneInput enableSearch />
				</FormItem>
			</SettingItem>
			<SettingItem label="Push Notifications" switchable defaultChecked />
			<SettingItem label="Email Notifications" switchable defaultChecked />
			<SettingItem label="Dark Mode" switchable defaultChecked />
		</Space>
	);
};

export default GeneralSettings;
