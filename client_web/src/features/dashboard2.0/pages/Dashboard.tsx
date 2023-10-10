import { Layout } from 'antd';
import { Content, Footer } from 'antd/es/layout/layout';
import React from 'react';
import CustomNavBar from '../../../core/components/CustomNavBar';

const layoutStyle: React.CSSProperties = {
	minHeight: '100vh',
	backgroundColor: '#fff',
};

const footerStyle: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.1)',
	background: '#fff',
};


const DashboardAutomations = () => {
    return (
        <Layout style={layoutStyle}>
            <CustomNavBar />
            <Footer style={footerStyle}>Area ©2023 Created by AREA EPITECH</Footer>
        </Layout>
    )
}

export default DashboardAutomations;