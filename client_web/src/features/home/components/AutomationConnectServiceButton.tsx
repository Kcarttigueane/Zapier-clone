import { Button, Image } from 'antd';
import { CSSProperties, FC } from 'react';
import { useTranslation } from 'react-i18next';
import Discord from '../../../core/assets/logo2D/Discord.png';
import Gmail from '../../../core/assets/logo2D/Gmail.png';
import GoogleCalendar from '../../../core/assets/logo2D/GoogleCalandar.png';
import GoogleDrive from '../../../core/assets/logo2D/GoogleDrive.png';
import Notification from '../../../core/assets/logo2D/Notification.png';
import OpenMeteo from '../../../core/assets/logo2D/OpenMeteo.png';
import Signal from '../../../core/assets/logo2D/Signal.png';
import Spotify from '../../../core/assets/logo2D/Spotify.png';
import Twitter from '../../../core/assets/logo2D/Twitter.png';
import Whatsapp from '../../../core/assets/logo2D/Whatsapp.png';
import Youtube from '../../../core/assets/logo2D/Youtube.png';

type ConnectServiceButtonProps = {
	service: string;
	connected: boolean;
	onClick: (service: string) => void;
	style?: CSSProperties;
};

const serviceToImageSrc: Record<string, string> = {
	discord: Discord,
	'google calendar': GoogleCalendar,
	'google drive': GoogleDrive,
	gmail: Gmail,
	youtube: Youtube,
	spotify: Spotify,
	notification: Notification,
	whatsapp: Whatsapp,
	signal: Signal,
	twitter: Twitter,
	weather: OpenMeteo,
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
	const handleClick = () => {
		onClick(service);
	};

	const buttonStyle = {
		...defaultStyles,
		...style,
	};

	return connected ? (
		<Button style={buttonStyle} disabled={true} size="small">
			{t('home.create.connected')}
		</Button>
	) : (
		<Button style={buttonStyle} onClick={handleClick} size="small">
			<Image
				preview={false}
				src={serviceToImageSrc[service.toLowerCase()]}
				alt={service}
				style={{ verticalAlign: 'middle', marginRight: 15 }}
				width={24}
			/>
			{t('home.create.authorize')}
		</Button>
	);
};

export default ConnectServiceButton;
