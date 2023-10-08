import React from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Typography, Row, Col, Layout, Button } from 'antd';

import Youtube from '../../../core/assets/logo2D/Youtube.png';
import Spotify from '../../../core/assets/logo2D/Spotify.png';

const { Text, Title } = Typography;

const CardStyle: React.CSSProperties = {
	width: '370px',
	height: '222px',
	boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
	border: '1px solid #BDBDBD',
	borderRadius: '5px',
	overflow: 'hidden',
};

const ContentStyle: React.CSSProperties = {
	width: '100%',
	height: '80%',
	backgroundColor: '#FFFDF9',
};

const ServicesStyle: React.CSSProperties = {
	display: 'flex',
	padding: '30px 0 20px 30px',
	gap: '10px',
};

const ImageStyle: React.CSSProperties = {
	width: '60px',
	height: '60px',
	border: '1px solid #E8E7E4',
	borderRadius: '8px',
};

const FooterStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	padding: '0 30px 0 30px',
	width: '100%',
	height: '20%',
	backgroundColor: '#D9D9D9',
};

const ButtonStyle: React.CSSProperties = {
	width: '323px',
	height: '49px',
	border: '1px solid #757575',
	borderRadius: '12px',
	marginTop: '50px',
	backgroundColor: '#FAFAFA',
};

interface CardProps {
	title: string;
	serviceLogos: string[];
	footerText: string;
}

const Card: React.FC<CardProps> = ({ title, serviceLogos, footerText }) => {
	return (
		<Col span={8}>
			<div style={CardStyle}>
				<div style={ContentStyle}>
					<div style={ServicesStyle}>
						{serviceLogos.map((logo, index) => (
							<img key={index} src={logo} alt="" style={ImageStyle} />
						))}
					</div>
					<Title level={4} style={{ paddingLeft: '30px' }}>
						{title}
					</Title>
				</div>
				<div style={FooterStyle}>
					<Text style={{ fontSize: '15px' }}>{footerText}</Text>
					<ArrowRightOutlined style={{ fontSize: '20px', color: '#FF4F00' }} />
				</div>
			</div>
		</Col>
	);
};

const RecommendSection = () => {
	return (
		<>
			<Title level={4} style={{ paddingLeft: '30px' }}>
				Recommend for you
			</Title>
			<Layout style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
				<Row gutter={24} style={{ paddingTop: '30px' }}>
					<Card
						title="Add liked song to your playlist"
						serviceLogos={[Youtube, Spotify]}
						footerText="Youtube + Spotify"
					/>
					<Card
						title="Add liked song to your playlist"
						serviceLogos={[Youtube, Spotify]}
						footerText="Youtube + Spotify"
					/>
					<Card
						title="Add liked song to your playlist"
						serviceLogos={[Youtube, Spotify]}
						footerText="Youtube + Spotify"
					/>
				</Row>
				<Row gutter={24} style={{ paddingTop: '30px' }}>
					<Card
						title="Add liked song to your playlist"
						serviceLogos={[Youtube, Spotify]}
						footerText="Youtube + Spotify"
					/>
					<Card
						title="Add liked song to your playlist"
						serviceLogos={[Youtube, Spotify]}
						footerText="Youtube + Spotify"
					/>
					<Card
						title="Add liked song to your playlist"
						serviceLogos={[Youtube, Spotify]}
						footerText="Youtube + Spotify"
					/>
				</Row>
				<Button style={ButtonStyle}>
					<Title level={4}>See More</Title>
				</Button>
			</Layout>
		</>
	);
};

export default RecommendSection;
