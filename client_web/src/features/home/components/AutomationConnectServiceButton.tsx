import { FC, CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Image } from 'antd';
import Spotify from '../../../core/assets/logo2D/Spotify.png';
import Youtube from '../../../core/assets/logo2D/Youtube.png';
import Discord from '../../../core/assets/logo2D/Discord.png';
import Gmail from '../../../core/assets/logo2D/Gmail.png';
import GoogleDrive from '../../../core/assets/logo2D/GoogleDrive.png';
import GoogleCalendar from '../../../core/assets/logo2D/GoogleCalandar.png';
import Twitter from '../../../core/assets/logo2D/Twitter.png';
import OpenMeteo from '../../../core/assets/logo2D/OpenMeteo.png';
import Whatsapp from '../../../core/assets/logo2D/Whatsapp.png';
import Signal from '../../../core/assets/logo2D/Signal.png';
import Notification from '../../../core/assets/logo2D/Notification.png';

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
	alignItems: 'center',
	width: '200px',
	height: '50px',
	borderRadius: '50px',
	fontSize: '20px',
	fontWeight: 'bold',
	display: 'flex',
	justifyContent: 'center',
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
		<Button style={buttonStyle} disabled={true}>
			{t('home.create.connected')}
		</Button>
	) : (
		<Button style={buttonStyle} onClick={handleClick}>
			<Image
				src={serviceToImageSrc[service.toLowerCase()]}
				alt={service}
				style={{ width: '30px', height: '30px', verticalAlign: 'middle', marginRight: 15 }}
			/>
			{t('home.create.authorize')}
		</Button>
	);
};

export default ConnectServiceButton;
