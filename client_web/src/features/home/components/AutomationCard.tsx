import { ArrowRightOutlined } from '@ant-design/icons';
import { Col, Typography } from 'antd';
import { FC } from 'react';

const { Text, Title } = Typography;

const CardStyle: React.CSSProperties = {
	width: '370px',
	height: '222px',
	boxShadow: '0 4px 4px rgba(0, 0, 0, 0.25)',
	border: '1px solid #BDBDBD',
	borderRadius: '8px',
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
	borderRadius: '12px',
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

interface CardProps {
	title: string;
	serviceLogos: string[];
	footerText: string;
}

const AutomationCard: FC<CardProps> = ({ title, serviceLogos, footerText }) => {
	return (
		<Col>
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

export default AutomationCard;
