import { GithubFilled, LinkedinFilled } from '@ant-design/icons';
import { Image, Layout, Space } from 'antd';
import Logo from '/logo.jpg';

const { Footer } = Layout;

const footerStyle: React.CSSProperties = {
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
	boxShadow: '0 -1px 4px rgba(0, 0, 0, 0.1)',
	background: '#fff',
};

const CustomFooter = () => {
	return (
		<Footer style={footerStyle}>
			<Image width={80} src={Logo} preview={false} />
			Area ©2023 Created by AREA EPITECH
			<Space size="large">
				<a
					href="https://www.linkedin.com/in/kevin-carttigueane-4798a9227/"
					target="_blank"
					rel="noopener noreferrer"
					style={{ color: 'inherit' }}
				>
					<LinkedinFilled style={{ fontSize: '2rem' }} />
				</a>
				<a
					href="https://github.com/Kcarttigueane"
					target="_blank"
					rel="noopener noreferrer"
					style={{ color: 'inherit' }}
				>
					<GithubFilled style={{ fontSize: '2rem' }} />
				</a>
			</Space>
		</Footer>
	);
};

export default CustomFooter;
