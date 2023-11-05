import { Select, Space } from 'antd';
import i18next from 'i18next';
import { useState } from 'react';

const AuthLanguageSelect = () => {
	const [selectedLanguage, setSelectedLanguage] = useState(
		i18next.language === 'fr' ? 'fr' : i18next.language === 'en' ? 'en' : 'es',
	);

	const changeLanguage = (language: string) => {
		i18next.changeLanguage(language);
		setSelectedLanguage(language);
	};

	return (
		<Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }}>
			<h2 style={{ fontSize: 32 }}>Area.</h2>
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
	);
};

export default AuthLanguageSelect;
