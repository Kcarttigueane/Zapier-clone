import { Col, Popover, Skeleton, Space, Typography } from 'antd';
import { FC, useState } from 'react';
import { ActionModelDTO } from '../../../../core/models/action';
import { capitalizeFirstLetter } from '../../../../core/utils/capitalizeFirstLetter';
import useActionStore from '../../../../core/zustand/useActionStore';
import { useTranslation } from 'react-i18next';

const { Text } = Typography;

const imageStyle: React.CSSProperties = {
	borderRadius: '12px',
	border: '1px solid #d9d9d9',
	padding: '12px',
	boxShadow: '0 0 8px rgba(0, 0, 0, .2)',
	transition: 'transform 0.2s ease-in-out',
	backgroundColor: '#fff',
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

interface ChooseActionProps {
	actions: ActionModelDTO[];
	selectedActionId: ActionModelDTO['id'] | null;
	setSelectedActionId: (id: ActionModelDTO['id'] | null) => void;
	selectedTriggerName: string;
	automationName: string;
	setAutomationName: (name: string) => void;
	selectedTriggerServiceName: string;
	selectedActionServiceName: string;
}

const ChooseAction: FC<ChooseActionProps> = ({
	actions,
	selectedActionId,
	setSelectedActionId,
	selectedTriggerName,
	automationName,
	setAutomationName,
	selectedTriggerServiceName,
	selectedActionServiceName,
}) => {
	const [hovered, setHovered] = useState<string | null>(null);
	const { isActionsLoading } = useActionStore((state) => state);
	const { t } = useTranslation();

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
											if (automationName == '') {
												setAutomationName(
													'[' +
														selectedTriggerServiceName +
														'] ' +
														selectedTriggerName +
														' ==> ' +
														'[' +
														selectedActionServiceName +
														'] ' +
														action.name,
												);
											}
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
