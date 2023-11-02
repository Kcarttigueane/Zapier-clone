import { Col, Popover, Skeleton, Space, Typography, theme } from 'antd';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TriggerModelDTO } from '../../../../core/models/trigger';
import { capitalizeFirstLetter } from '../../../../core/utils/capitalizeFirstLetter';
import useTriggerStore from '../../../../core/zustand/useTriggerStore';

const { Text } = Typography;

interface ChooseTriggerProps {
	triggers: TriggerModelDTO[];
	selectedTriggerId: TriggerModelDTO['id'] | null;
	setSelectedTriggerId: (id: TriggerModelDTO['id'] | null) => void;
}

const hoverStyle: React.CSSProperties = {
	transform: 'scale(1.05)',
};

const ChooseTrigger: FC<ChooseTriggerProps> = ({ triggers, selectedTriggerId, setSelectedTriggerId }) => {
	const [hovered, setHovered] = useState<string | null>(null);
	const { isTriggersLoading } = useTriggerStore((state) => state);
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
									title={t(trigger.description)}
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
