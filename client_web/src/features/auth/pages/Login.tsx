import React from 'react';
import RightArea from '../components/RightArea';

import { Button, Divider, Select, Space, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import Flex from '../../../core/components/Flex';
import LoginForm from '../components/LoginFrom';
import Services from '../components/Services';

const mainContainerStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	height: '100vh',
};

const mainBoxStyle: React.CSSProperties = {
	display: 'grid',
	gridTemplateColumns: '1fr 1fr',
	width: '80%',
	height: '90vh',
	borderRadius: '50px',
	border: '1px solid black',
	boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
	overflow: 'hidden',
};

const { Text } = Typography;

const titleStyle: React.CSSProperties = {
	fontSize: 36,
	fontWeight: 'bold',
	color: '#000',
	alignSelf: 'center',
};

const greetingStyle: React.CSSProperties = {
	fontSize: 20,
	fontWeight: 'bold',
	color: '#898888',
	alignSelf: 'center',
	marginBottom: 16,
};

const Login = () => {
	const navigate = useNavigate();

	const handleChange = (value: string) => {
		console.log(`selected ${value}`);
	};

	return (
		<div style={mainContainerStyle}>
			<div style={mainBoxStyle}>
				<Flex direction="column" style={{ height: '100%', lineHeight: '0%', padding: '64px' }} align="center">
					<Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
						<h2 style={{ color: '#000', fontSize: 32 }}>Area.</h2>
						<Select
							defaultValue="French"
							style={{ width: 60 }}
							onChange={handleChange}
							options={[
								{ value: 'French', label: '🇫🇷' },
								{ value: 'English', label: '🇬🇧' },
								{ value: 'Spanish', label: '🇪🇸' },
							]}
						/>
					</Space>
					<Text style={titleStyle}>Login</Text>
					<Text style={greetingStyle}>Welcome Back to the App</Text>
					<Services />
					<Space style={{ width: '60%' }} direction="vertical">
						<Divider plain>Or</Divider>
						<LoginForm />
						<Space style={{ alignSelf: 'center' }}>
							<Text>Don't have an account?</Text>
							<Button type="link" onClick={() => navigate('/auth/register')}>
								Register
							</Button>
						</Space>
					</Space>
				</Flex>
				<RightArea />
			</div>
		</div>
	);
};

export default Login;
