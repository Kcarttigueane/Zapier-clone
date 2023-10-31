import { Col, Popover, Skeleton, Space, Typography } from 'antd';
import { FC, useState } from 'react';
import { TriggerModelDTO } from '../../../../core/models/trigger';
import { capitalizeFirstLetter } from '../../../../core/utils/capitalizeFirstLetter';
import useTriggerStore from '../../../../core/zustand/useTriggerStore';

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

interface ChooseTriggerProps {
	triggers: TriggerModelDTO[];
	selectedTriggerId: TriggerModelDTO['id'] | null;
	setSelectedTriggerId: (id: TriggerModelDTO['id'] | null) => void;
	setSelectedTriggerName: (name: string) => void;
}

const ChooseTrigger: FC<ChooseTriggerProps> = ({
	triggers,
	selectedTriggerId,
	setSelectedTriggerId,
	setSelectedTriggerName,
}) => {
	const [hovered, setHovered] = useState<string | null>(null);
	const { isTriggersLoading } = useTriggerStore((state) => state);

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
				{isTriggersLoading
					? Array.from({ length: 9 }).map((_, index) => (
							<Space size={12} style={{ borderRadius: 16 }} key={index}>
								<Skeleton.Image active={true} />
							</Space>
					  ))
					: triggers.map((trigger: TriggerModelDTO) => {
							const isSelected = trigger.id === selectedTriggerId;
							return (
								<Popover
									title={capitalizeFirstLetter(trigger.description)}
									key={trigger.id}
									placement="bottom"
									style={{
										textAlign: 'center',
										flexDirection: 'column',
										alignItems: 'center',
										alignContent: 'center',
									}}
								>
									<Space
										key={trigger.id}
										direction="vertical"
										style={{
											...imageStyle,
											...(hovered === trigger.id && hoverStyle),
											borderColor: isSelected ? '#1890ff' : '#d9d9d9',
											borderWidth: isSelected ? '2px' : '1px',
										}}
										onMouseEnter={() => setHovered(trigger.id)}
										onMouseLeave={() => setHovered(null)}
										onClick={() => {
											setSelectedTriggerId(trigger.id);
											setSelectedTriggerName(trigger.name);
										}}
									>
										<Text>{capitalizeFirstLetter(trigger.name)}</Text>
									</Space>
								</Popover>
							);
					  })}
			</Col>
		</>
	);
};

export default ChooseTrigger;
