import { Button, Image } from 'antd';
import { CSSProperties, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ServiceModelDTO } from '../../../core/models/service';

type ConnectServiceButtonProps = {
	service: ServiceModelDTO;
	connected: boolean;
	onClick: (service: string) => void;
	style?: CSSProperties;
};

const defaultStyles: CSSProperties = {
	display: 'flex',
	padding: '20px 16px',
	justifyContent: 'center',
	alignItems: 'center',
	borderRadius: '50px',
	fontWeight: 'bold',
	gap: '10px',
};

const ConnectServiceButton: FC<ConnectServiceButtonProps> = ({ service, connected, onClick, style }) => {
	const { t } = useTranslation();

	const handleClick = () => onClick(service.name);

	const buttonStyle = {
		...defaultStyles,
		...style,
	};

	return (
		<Button style={buttonStyle} disabled={connected} size="small" {...(connected ? {} : { onClick: handleClick })}>
			<Image
				preview={false}
				src={`data:image/svg+xml;base64,${service.icon_svg_base64}`}
				alt={service.name}
				style={{ verticalAlign: 'middle', marginRight: 15 }}
				width={24}
			/>
			{connected ? t('home.create.connected') : t('home.create.authorize')}
		</Button>
	);
};

export default ConnectServiceButton;
