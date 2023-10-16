import { Button, Col, Space, Typography } from 'antd';
import React from 'react';

import Spotify from '../../../core/assets/logo2D/Spotify.png';
import Youtube from '../../../core/assets/logo2D/Youtube.png';
import AutomationCard from './AutomationCard';

const { Title } = Typography;

const ButtonStyle: React.CSSProperties = {
	width: '300px',
	height: '48px',
	border: '1px solid #757575',
	borderRadius: '12px',
	fontSize: '16px',
	fontWeight: 'bold',
	marginTop: '12px',
};

const RecommendSection = () => {
	return (
		<Space direction="vertical" size={32} align="center" style={{ width: '100%' }}>
			<Title level={4}>Recommend for you</Title>
			<Col
				style={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: '30px',
					justifyContent: 'center',
					backgroundColor: '#fff',
				}}
			>
				<AutomationCard
					title="Add liked song to your playlist"
					serviceLogos={[Youtube, Spotify]}
					footerText="Youtube + Spotify"
				/>
				<AutomationCard
					title="Add liked song to your playlist"
					serviceLogos={[Youtube, Spotify]}
					footerText="Youtube + Spotify"
				/>
				<AutomationCard
					title="Add liked song to your playlist"
					serviceLogos={[Youtube, Spotify]}
					footerText="Youtube + Spotify"
				/>
				<AutomationCard
					title="Add liked song to your playlist"
					serviceLogos={[Youtube, Spotify]}
					footerText="Youtube + Spotify"
				/>
				<AutomationCard
					title="Add liked song to your playlist"
					serviceLogos={[Youtube, Spotify]}
					footerText="Youtube + Spotify"
				/>
				<AutomationCard
					title="Add liked song to your playlist"
					serviceLogos={[Youtube, Spotify]}
					footerText="Youtube + Spotify"
				/>
			</Col>
			<Button style={ButtonStyle}>See More</Button>
		</Space>
	);
};

export default RecommendSection;
