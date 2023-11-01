import { Col, Popover, Skeleton, Space, Typography, theme } from 'antd';
import { FC, useState } from 'react';
import { ActionModelDTO } from '../../../../core/models/action';
import { capitalizeFirstLetter } from '../../../../core/utils/capitalizeFirstLetter';
import useActionStore from '../../../../core/zustand/useActionStore';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;


interface ChooseActionProps {
	actions: ActionModelDTO[];
	selectedActionId: ActionModelDTO['id'] | null;
	setSelectedActionId: (id: ActionModelDTO['id'] | null) => void;
}

const ChooseAction: FC<ChooseActionProps> = ({ actions, selectedActionId, setSelectedActionId }) => {
	const [hovered, setHovered] = useState<string | null>(null);
	const { isActionsLoading } = useActionStore((state) => state);
	const { t } = useTranslation();
	const { token } = theme.useToken();

	const imageStyle: React.CSSProperties = {
		borderRadius: '12px',
		border: '1px solid #d9d9d9',
		padding: '12px',
		boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
		transition: 'transform 0.2s ease-in-out',
		backgroundColor: token.colorBgElevated,
		minWidth: '120px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		gap: '16px',
	};
	
	const hoverStyle: React.CSSProperties = {
		transform: 'scale(1.05)',
	};

	return (
		<>
			<Col
				style={{
					display: 'flex',
					flexDirection: 'row',
					flexWrap: 'wrap',
					gap: '36px',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{isActionsLoading
					? Array.from({ length: 9 }).map((_, index) => (
							<Space size={12} style={{ borderRadius: 16 }} key={index}>
								<Skeleton.Image active={true} />
							</Space>
					  ))
					: actions.map((action: ActionModelDTO) => {
							const isSelected = action.id === selectedActionId;
							return (
								<Popover
									title={t(action.description)}
									key={action.id}
									placement="bottom"
									style={{
										textAlign: 'center',
										flexDirection: 'column',
										alignItems: 'center',
										alignContent: 'center',
									}}
								>
									<Space
										key={action.id}
										direction="vertical"
										style={{
											...imageStyle,
											...(hovered === action.id && hoverStyle),
											borderColor: isSelected ? '#1890ff' : '#d9d9d9',
											borderWidth: isSelected ? '2px' : '1px',
										}}
										onMouseEnter={() => setHovered(action.id)}
										onMouseLeave={() => setHovered(null)}
										onClick={() => {
											setSelectedActionId(action.id);
										}}
									>
										<Text>{capitalizeFirstLetter(action.name)}</Text>
									</Space>
								</Popover>
							);
					  })}
			</Col>
		</>
	);
};

export default ChooseAction;
