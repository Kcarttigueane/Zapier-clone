import { FC, CSSProperties } from 'react';
import { Button } from 'antd';
import Spotify from '../../../core/assets/logo2D/Spotify.png';
import Youtube from '../../../core/assets/logo2D/Youtube.png';
import Discord from '../../../core/assets/logo2D/Discord.png';
import Gmail from '../../../core/assets/logo2D/Gmail.png';
import GoogleDrive from '../../../core/assets/logo2D/GoogleDrive.png';
import GoogleCalendar from '../../../core/assets/logo2D/GoogleCalandar.png';


type ConnectServiceButtonProps = {
	service: string;
	connected: boolean;
	onClick: (service: string) => void;
	style?: CSSProperties;
};

const serviceToImageSrc: Record<string, string> = {
	'discord': Discord,
	'google calendar': GoogleCalendar,
	'google drive': GoogleDrive,
	'gmail': Gmail,
	'youtube': Youtube,
	'spotify': Spotify,
};

const ConnectServiceButton: FC<ConnectServiceButtonProps> = ({ service, connected, onClick, style }) => {
	const handleClick = () => {
		onClick(service);
	};

	const defaultStyles: CSSProperties = {
		alignItems: 'center',
		width: '200px',
		height: '50px',
		borderRadius: '50px',
		fontSize: '20px',
		fontWeight: 'bold',
		display: 'flex',
		justifyContent: 'center'
	};

	const buttonStyle = {
		...defaultStyles,
		...style,
	};

	return (
		connected ? (
			<Button style={buttonStyle} disabled={true}>
				Already Connected
			</Button>
		) : (
			<Button style={buttonStyle} onClick={handleClick}>
				<img
					src={serviceToImageSrc[service.toLowerCase()]}
					alt={service}
					style={{ width: '30px', height: '30px',  verticalAlign: 'middle', marginRight: 15}}
				/>
				Authorize
			</Button>
		)
	);
};

export default ConnectServiceButton;