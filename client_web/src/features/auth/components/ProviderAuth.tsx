import { Image, Space } from 'antd';
import React, { useState } from 'react';

import Google from '../../../core/assets/providerAuthLogo/Google.png';
import Spotify from '../../../core/assets/providerAuthLogo/Spotify.png';
import Github from '../../../core/assets/providerAuthLogo/github.png';
import { useAuthStore } from '../../../core/zustand/useAuthStore';

const imageStyle: React.CSSProperties = {
	borderRadius: '12px',
	border: '1px solid #d9d9d9',
	padding: '8px',
	boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
	transition: 'transform 0.2s ease-in-out',
	marginTop: '12px',
};

const hoverStyle: React.CSSProperties = {
	transform: 'scale(1.1)',
};

const ProviderAuth: React.FC = () => {
	const [hovered, setHovered] = useState<number | null>(null);
	const { loginWithSpotify, loginWithGoogle, loginWithGitHub } = useAuthStore((state) => state);

	const handleServiceClick = (service: string) => {
		switch (service) {
			case 'Spotify':
				loginWithSpotify();
				break;
			case 'Google':
				loginWithGoogle();
				break;
			case 'Github':
				loginWithGitHub();
				break;
			default:
				console.warn(`Unknown service: ${service}`);
		}
	};

	return (
		<Space size={60} style={{ display: 'flex', justifyContent: 'center' }}>
			{['Spotify', 'Google', 'Github'].map((item, index) => (
				<Space
					key={index}
					style={{
						...imageStyle,
						...(hovered === index && hoverStyle), // Apply hoverStyle if hovered
					}}
					onMouseEnter={() => setHovered(index)}
					onMouseLeave={() => setHovered(null)}
					onClick={() => handleServiceClick(item)}
				>
					<Image width={40} src={item === 'Spotify' ? Spotify : item === 'Google' ? Google : Github} preview={false} />
				</Space>
			))}
		</Space>
	);
};

export default ProviderAuth;
