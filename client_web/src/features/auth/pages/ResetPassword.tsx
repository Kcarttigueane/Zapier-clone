import React, { useState } from 'react';

import { Select, Space, Typography } from 'antd';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import Flex from '../../../core/components/Flex';
import RightArea from '../components/RightArea';
import ResetForm from '../components/ResetPasswordForm';

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

	const [selectedLanguage, setSelectedLanguage] = useState(
		i18next.language === 'fr' ? 'fr' : i18next.language === 'en' ? 'en' : 'es',
	);

	const changeLanguage = (language: string) => {
		i18next.changeLanguage(language);
		setSelectedLanguage(language);
	};

	return (
		<div style={mainContainerStyle}>
			<div style={mainBoxStyle}>
				<Flex direction="column" style={{ height: '100%', lineHeight: '0%', padding: '64px' }} align="center">
					<Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
						<h2 style={{ color: '#000', fontSize: 32 }}>Area.</h2>
						<Select
							defaultValue={selectedLanguage}
							style={{ width: 60 }}
							onChange={changeLanguage}
							options={[
								{ value: 'fr', label: '🇫🇷' },
								{ value: 'en', label: '🇬🇧' },
								{ value: 'es', label: '🇪🇸' },
							]}
						/>
					</Space>
					<div
						style={{
							flex: 1,
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
						}}
					>
						<Text style={titleStyle}>{t('auth.resetPassword.title')}</Text>
						<Text style={greetingStyle}>{t('auth.resetPassword.welcome')}</Text>
						<Space style={{ width: '60%' }} direction="vertical">
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
