import { CSSProperties, FC, ReactNode } from 'react';

interface FlexProps {
	children: ReactNode;
	direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
	align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
	justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
	gap?: number | string;
	style?: CSSProperties;
}

const Flex: FC<FlexProps> = ({
	children,
	direction = 'row',
	align = 'stretch',
	justify = 'flex-start',
	gap = 0,
	style,
	...props
}) => {
	const flexStyle: CSSProperties = {
		display: 'flex',
		flexDirection: direction,
		alignItems: align,
		justifyContent: justify,
		gap: gap,
		...style,
	};

	return (
		<div style={flexStyle} {...props}>
			{children}
		</div>
	);
};

export default Flex;
