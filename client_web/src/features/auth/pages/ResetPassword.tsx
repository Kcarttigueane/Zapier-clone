import React from 'react';

import { Space, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Flex from '../../../core/components/Flex';
import AuthLanguageSelect from '../components/AuthLanguageSelect';
import ResetForm from '../components/ResetPasswordForm';
import RightArea from '../components/RightArea';

const mainContainerStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100vh',
};

const mainBoxStyle: React.CSSProperties = {
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	width: '85%',
	height: '90vh',
	borderRadius: '50px',
	border: '1px solid black',
	boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
	overflow: 'hidden',
};

const { Text } = Typography;

const titleStyle: React.CSSProperties = {
	fontSize: 36,
	fontWeight: 'bold',
	color: '#000',
	alignSelf: 'center',
};

const greetingStyle: React.CSSProperties = {
	fontSize: 20,
	fontWeight: 'bold',
	color: '#898888',
	alignSelf: 'center',
	marginBottom: 16,
};

const ForgotPassword = () => {
	const { t } = useTranslation();

	return (
		<div style={mainContainerStyle}>
			<div style={mainBoxStyle}>
				<Flex direction="column" style={{ height: '100%', lineHeight: '0%', padding: '64px' }} align="center">
					<AuthLanguageSelect />
					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
							width: '100%',
							marginTop: 48,
							gap: 24,
						}}
					>
						<Text style={titleStyle}>{t('auth.resetPassword.title')}</Text>
						<Text style={greetingStyle}>{t('auth.resetPassword.welcome')}</Text>
						<Space style={{ width: '60%' }} direction="vertical" size="large">
							<ResetForm />
						</Space>
					</div>
				</Flex>
				<RightArea />
			</div>
		</div>
	);
};

export default ForgotPassword;
