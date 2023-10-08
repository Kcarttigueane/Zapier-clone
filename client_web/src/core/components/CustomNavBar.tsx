import { BellOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Badge, Dropdown, Input, MenuProps, Space, Typography, message } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const headerStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	margin: '12px 24px',
	borderRadius: '50px',
	boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px',
	backgroundColor: '#fff',
};

const searchBarStyle: React.CSSProperties = {
	width: '300px',
};

const rightHeaderStyle: React.CSSProperties = {
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'space-between',
	borderRadius: '50px',
	border: '1px solid #d9d9d9',
	height: '50px',
	padding: '8px 8px 8px 16px',
};

const items: MenuProps['items'] = [
	{
		key: '1',
		label: (
			<Space size="small">
				<SettingOutlined />
				<Text>Settings</Text>
			</Space>
		),
	},
	{
		key: '2',
		label: (
			<Space size="small">
				<LogoutOutlined />
				<Text>Logout</Text>
			</Space>
		),
	},
];

const CustomNavBar = () => {
	const navigate = useNavigate();

	const onClick: MenuProps['onClick'] = ({ key }) => {
		switch (key) {
			case '1':
				navigate('/settings');
				break;
			case '2':
				navigate('/auth/login');
				break;
			default:
				message.info(`Click on item ${key}`);
		}
	};

	return (
		<Header style={headerStyle}>
			<Space>
				<Avatar size={60} src={<img src={'/logo.jpg'} alt="Logo" />} />
				<p style={{ margin: '0 0 0 16px' }}>Area.</p>
			</Space>
			<Input.Search placeholder="input search text" size="large" allowClear bordered style={searchBarStyle} />
			<Space style={rightHeaderStyle} size="large">
				<Badge count={5} size="small">
					<BellOutlined style={{ fontSize: '20px' }} />
				</Badge>
				<Dropdown menu={{ items, onClick }} placement="bottom" trigger={['click']}>
					<Avatar
						size="large"
						icon={
							<img
								src={
									'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60'
								}
								alt="Avatar"
							/>
						}
					/>
				</Dropdown>
			</Space>
		</Header>
	);
};

export default CustomNavBar;
