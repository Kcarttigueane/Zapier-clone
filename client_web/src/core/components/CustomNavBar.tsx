import { BellOutlined, MenuOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Badge, Input, Space } from 'antd';
import { Header } from 'antd/es/layout/layout';
import React from 'react';

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
	padding: '8px 12px',
};

const CustomNavBar = () => {
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
				<MenuOutlined style={{ fontSize: '20px' }} />
				<Avatar size="large" icon={<UserOutlined />} />
			</Space>
		</Header>
	);
};

export default CustomNavBar;
