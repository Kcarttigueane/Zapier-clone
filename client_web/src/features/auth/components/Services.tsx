import { Image, Space } from 'antd';
import React from 'react';

import Github from '../../../core/assets/logo2D/github.png';
import Google from '../../../core/assets/logo2D/Google.png';
import Spotify from '../../../core/assets/logo2D/Spotify.png';

const imageStyle: React.CSSProperties = {
	borderRadius: '12px',
	border: '1px solid #d9d9d9',
	padding: '8px',
	boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
};

const Services: React.FC = () => {
	// const { loginWithGoogle, loginWithSpotify, loginWithGitHub } = useAuthStore();

	return (
		<Space size={40} style={{ display: 'flex', justifyContent: 'center' }}>
			<Space style={imageStyle} /* onClick={() => loginWithSpotify()} */>
				<Image width={40} src={Spotify} preview={false} />
			</Space>
			<Space style={imageStyle} /* onClick={() => loginWithGoogle()} */>
				<Image width={40} src={Google} preview={false} />
			</Space>
			<Space style={imageStyle} /* onClick={() => loginWithGitHub()} */>
				<Image width={40} src={Github} preview={false} />
			</Space>
		</Space>
	);
};
export default Services;
