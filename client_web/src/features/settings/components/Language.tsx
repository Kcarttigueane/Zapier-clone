import { Space } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import LanguageItem from './LanguageItem';

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

const languages = [
	{ code: 'en', name: 'english', url: 'us' },
	{ code: 'fr', name: 'french', url: 'fr' },
	{ code: 'es', name: 'spanish', url: 'sp' },
];

const Language = () => {
	const { t } = useTranslation();
	const [currentLanguage, setCurrentLanguage] = useState<string>(i18next.language);

	const changeLanguage = (language: string) => {
		i18next.changeLanguage(language);
		setCurrentLanguage(language);
	};

	return (
		<Space direction="vertical" size={12} style={containerStyle}>
			<div style={labelStyle}>{t('settings.settingScreen.languages.description')}</div>
			{languages.map((language) => (
				<LanguageItem
					key={language.code}
					imageUrl={`https://www.worldometers.info/img/flags/${language.url}-flag.gif`}
					language={language.name}
					checked={language.code === currentLanguage}
					onChange={() => changeLanguage(language.code)}
				/>
			))}
		</Space>
	);
};

export default Language;
