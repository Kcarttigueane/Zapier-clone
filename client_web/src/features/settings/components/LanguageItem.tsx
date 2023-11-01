import { Image, Space, Checkbox, theme } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageItemProps {
	imageUrl: string;
	language: string;
	onChange: () => void; // Change to correct prop type
	checked: boolean;
}

const LanguageItem: React.FC<LanguageItemProps> = ({ imageUrl, language, onChange, checked }) => {
	const { t } = useTranslation();
	const { token } = theme.useToken();

	const cardStyle: React.CSSProperties = {
		width: 400,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		border: '1px solid #d9d9d9',
		borderRadius: '12px',
		padding: '12px 24px',
	};

	return (
		<Space style={cardStyle}>
			<Image width={32} src={imageUrl} />
			<p style={{ margin: '0 0 0 16px', color: token.colorText }}>
				{t(`settings.settingScreen.languages.${language}`)}
			</p>
			<Checkbox checked={checked} onChange={onChange} />
		</Space>
	);
};

export default LanguageItem;
