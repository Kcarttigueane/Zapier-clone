import { Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ConnectedServiceItem from './ConnectedServiceItem';

const containerStyle: React.CSSProperties = {
	border: '1px solid #d9d9d9',
	padding: '60px 140px',
	borderRadius: '12px',
};

const labelStyle: React.CSSProperties = {
	textAlign: 'center' as React.CSSProperties['textAlign'],
	color: 'black',
	fontSize: 14,
	fontWeight: 600,
	wordWrap: 'break-word',
	marginBottom: 24,
};

const ConnectedServices = () => {
	const { t } = useTranslation();

	return (
		<Space direction="vertical" size={12} style={containerStyle}>
			<div style={labelStyle}>{t('settings.settingScreen.connectedServices.description')}</div>
			<ConnectedServiceItem
				imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Gmail_icon_%282020%29.svg/2560px-Gmail_icon_%282020%29.svg.png"
				serviceName="Gmail"
				defaultChecked
			/>
			<ConnectedServiceItem
				imageUrl="https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1024px-Spotify_logo_without_text.svg.png"
				serviceName="Spotify"
				defaultChecked
			/>
			<ConnectedServiceItem
				imageUrl="https://assets.stickpng.com/images/580b57fcd9996e24bc43c545.png"
				serviceName="WhatsApp"
				defaultChecked
			/>
		</Space>
	);
};

export default ConnectedServices;
