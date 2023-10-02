import React from 'react';

import { Image, Space, Typography } from 'antd';
import Logo from '../../../core/assets/demo_page/logo.png';
import Reddit from '../../../core/assets/logo3D/Reddit.png';
import Tinder from '../../../core/assets/logo3D/Tinder.png';
import Twitter from '../../../core/assets/logo3D/Twitter.png';
import Flex from '../../../core/components/Flex';

const { Text } = Typography;

const textStyles: React.CSSProperties = {
	fontSize: 22,
	fontWeight: 'bold',
	color: '#fff',
	textAlign: 'center',
};

const RightArea: React.FC = () => {
	return (
		<Flex
			direction="column"
			align="center"
			justify="center"
			gap={48}
			style={{ padding: '64px', background: 'linear-gradient(#000000, #414141)' }}
		>
			<Image width={180} src={Logo} alt="Automation Logo" preview={false} />

			<Space direction="horizontal" size={32}>
				<Image width={120} src={Tinder} alt="Tinder Logo" preview={false} />

				<Image width={120} src={Reddit} alt="Reddit Logo" preview={false} />

				<Image width={120} src={Twitter} alt="Twitter Logo" preview={false} />
			</Space>

			<Text style={textStyles}>Link your favorite apps and simplify your life by using the power of automation.</Text>
		</Flex>
	);
};

export default RightArea;
