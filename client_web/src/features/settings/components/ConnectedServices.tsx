import { Space, Spin, message, theme } from 'antd';
import React, { useEffect } from 'react';
import useServicesStore from '../../../core/zustand/useServiceStore';
import ConnectedServiceItem from './ConnectedServiceItem';


const ConnectedServices = () => {
	const { userAuthorizedServices, fetchUserAuthorizedServices, isLoading } = useServicesStore((state) => state);
	const [messageApi, contextHolder] = message.useMessage();
	const { token } = theme.useToken();

	const containerStyle: React.CSSProperties = {
		border: '1px solid #d9d9d9',
		padding: '60px 140px',
		borderRadius: '12px',
		color: token.colorText
	};

	useEffect(() => {
		if (userAuthorizedServices.length > 0) {
			return;
		}
		try {
			fetchUserAuthorizedServices();
		} catch (error: any) {
			console.error('Error fetching automations', error);
			messageApi.open({
				type: 'error',
				content: error.response.data.detail || 'Something went wrong',
			});
		}
	}, []);

	if (isLoading) {
		return <Spin />;
	}

	return (
		<>
			{contextHolder}
			<Space direction="vertical" size={12} style={containerStyle}>
				{userAuthorizedServices.map((service) => (
					<ConnectedServiceItem
						key={service.id}
						imageUrl={service.icon_svg_base64}
						serviceName={service.name}
						defaultChecked={service.is_authorized}
					/>
				))}
			</Space>
		</>
	);
};

export default ConnectedServices;
