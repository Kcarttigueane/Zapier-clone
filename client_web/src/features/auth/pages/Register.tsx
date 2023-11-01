import React from 'react';

import { Button, Divider, Space, Typography, theme } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Flex from '../../../core/components/Flex';
import AuthLanguageSelect from '../components/AuthLanguageSelect';
import ProviderAuth from '../components/ProviderAuth';
import RegisterForm from '../components/RegisterForm';
import RightArea from '../components/RightArea';


const Register = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { token } = theme.useToken();

	const mainContainerStyle: React.CSSProperties = {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: '100vh',
		backgroundColor: token.colorBgBase,
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
		backgroundColor: token.colorBgContainer,
		color: token.colorText,
		
	};
	
	const { Text } = Typography;
	
	const titleStyle: React.CSSProperties = {
		fontSize: 36,
		fontWeight: 'bold',
		color: token.colorText,
		alignSelf: 'center',
	};
	
	const greetingStyle: React.CSSProperties = {
		fontSize: 20,
		fontWeight: 'bold',
		color: token.colorTextDescription,
		alignSelf: 'center',
		marginBottom: 16,
	};

	return (
		<div style={mainContainerStyle}>
			<div style={mainBoxStyle}>
				<Flex direction="column" style={{ height: '100%', lineHeight: '0%', padding: '48px' }} align="center">
					<AuthLanguageSelect />
					<Text style={titleStyle}>{t('auth.register.title')}</Text>
					<Text style={greetingStyle}>{t('auth.register.welcome')}</Text>
					<ProviderAuth />
					<Space style={{ width: '60%' }} direction="vertical">
						<Divider
							plain
							style={{
								height: 12,
							}}
						>
							{t('basic.actions.or')}
						</Divider>
						<RegisterForm />
					</Space>
					<Space>
						<Text>{t('auth.haveAccount')}</Text>
						<Button type="link" onClick={() => navigate('/auth/login')} style={{ padding: 0 }}>
							{t('auth.login.title')}
						</Button>
					</Space>
				</Flex>
				<RightArea />
			</div>
		</div>
	);
};

export default Register;
