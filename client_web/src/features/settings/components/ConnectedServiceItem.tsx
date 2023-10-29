import { Image, Space, Switch } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { capitalizeFirstLetter } from '../../../core/utils/capitalizeFirstLetter';
import { useAuthStore } from '../../../core/zustand/useAuthStore';

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
	const { t } = useTranslation();
	const { authorizeService } = useAuthStore((state) => state);

	const googleServices = ['calendar', 'drive', 'gmail', 'youtube'];

	const getGoogleServiceName = (service: string) => {
		const isGoogleService = service.toLowerCase().startsWith('google');
		if (isGoogleService) {
			return service.split(' ')[1];
		}
		return service.toLowerCase();
	};

	const handleConnectService = (service: string) => {
		const googleServiceName = getGoogleServiceName(service);

		if (googleServices.includes(googleServiceName)) {
			authorizeService('google', googleServiceName);
		} else if (service == 'spotify') {
			authorizeService('spotify', 'spotify');
		} else if (service == 'github') {
			authorizeService('github', 'github');
		}
	};

	return (
		<Space style={cardStyle}>
			<Image width={32} src={`data:image/svg+xml;base64,${imageUrl}`} preview={false} />
			<p style={{ margin: '0 0 0 16px' }}>{capitalizeFirstLetter(serviceName)}</p>
			<style>
				{`
					.switch-checked {
							background-color: #00C247 !important;
					}
					.switch-unchecked {
							background-color: #B60000 !important;
					}
				`}
			</style>
			<Switch
				checkedChildren={t('settings.enabled')}
				unCheckedChildren={t('settings.disabled')}
				checked={defaultChecked}
				style={{
					fontSize: '20px',
					fontWeight: 'bold',
				}}
				onChange={() => {
					handleConnectService(serviceName);
					// TODO : Need to create a endpoint to remove the oauth from the user based on the service name
				}}
				className={defaultChecked ? 'switch-checked' : 'switch-unchecked'}
			/>
		</Space>
	);
};

export default ConnectedServiceItem;
