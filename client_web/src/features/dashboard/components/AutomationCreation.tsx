import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Select, Typography } from 'antd';
import { useState } from 'react';
import Flex from '../../../core/components/Flex';

const { Text } = Typography;

const TitleStyle: React.CSSProperties = {
	fontSize: 24,
	fontWeight: 'bold',
	alignSelf: 'center',
};

const DividerStyle: React.CSSProperties = {
	width: '68px',
	border: '0.5px solid #757575',
	marginTop: '24px',
};

const InputStyle: React.CSSProperties = {
	width: '286px',
	height: '48px',
};

const serviceOptions = [
	{
		value: 'twitter',
		label: 'Twitter',
	},
	{
		value: 'google drive',
		label: 'Google Drive',
	},
	{
		value: 'google calendar',
		label: 'Google Calendar',
	},
	{
		value: 'gmail',
		label: 'Gmail',
	},
	{
		value: 'open meteo',
		label: 'Open Meteo',
	},
	{
		value: 'youtube',
		label: 'Youtube',
	},
];

const triggerOptions = [
	{
		value: 'receive like',
		label: 'Receive Like',
	},
	{
		value: 'receive replie',
		label: 'Receive Replie',
	},
	{
		value: 'new folder',
		label: 'New Folder',
	},
	{
		value: 'new file',
		label: 'New File',
	},
	{
		value: 'event',
		label: 'Event',
	},
	{
		value: 'birthday event',
		label: 'Birthday Event',
	},
	{
		value: 'hourly forecast',
		label: 'Hourly Forecast',
	},
	{
		value: 'liked video',
		label: 'Liked Video',
	},
	{
		value: 'new attachement',
		label: 'New Attachement',
	},
];

const reactionOptions = [
	{
		value: 'app notification',
		label: 'App Notification',
	},
	{
		value: 'send message',
		label: 'Send Message',
	},
	{
		value: 'add to playlist',
		label: 'Add to Playlist',
	},
	{
		value: 'upload file',
		label: 'Upload File',
	},
];

const AutomationCreation = () => {
	const [selectedService1, setSelectedService1] = useState<string | null>(null);
	const [selectedService2, setSelectedService2] = useState<string | null>(null);
	const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
	const [selectedReaction, setSelectedReaction] = useState<string | null>(null);

	const onServiceChange1 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService1(value);
	};

	const onServiceChange2 = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedService2(value);
	};

	const onTriggerChange = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedTrigger(value);
	};

	const onReactionChange = (value: string) => {
		console.log(`selected ${value}`);
		setSelectedReaction(value);
	};

	const onSearch = (value: string) => {
		console.log('search:', value);
	};

	const filterOption = (input: string, option?: { label: string; value: string }) =>
		(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

	return (
		<>
			<Text style={TitleStyle}>Create a Zap</Text>
			<Flex align="center" justify="center">
				<Flex direction="column" align="center" justify="center" gap="6px">
					<Text
						style={{
							fontSize: '14px',
							fontWeight: 'bold',
						}}
					>
						Connect this service...
					</Text>
					<Select
						showSearch
						placeholder="Select a Service"
						optionFilterProp="children"
						onChange={onServiceChange1}
						onSearch={onSearch}
						filterOption={filterOption}
						style={InputStyle}
						options={serviceOptions}
					/>
				</Flex>
				<span style={DividerStyle} />
				<PlusCircleOutlined style={{ fontSize: '32px', color: '#757575', padding: '0 5px', marginTop: '24px' }} />
				<span style={DividerStyle} />
				<Flex direction="column" align="center" justify="center" gap="6px">
					<Text
						style={{
							fontSize: '14px',
							fontWeight: 'bold',
						}}
					>
						...with this one.
					</Text>
					<Select
						showSearch
						placeholder="Select a Service"
						optionFilterProp="children"
						onChange={onServiceChange2}
						onSearch={onSearch}
						filterOption={filterOption}
						style={InputStyle}
						options={serviceOptions}
					/>
				</Flex>
			</Flex>
			{selectedService1 && selectedService2 ? (
				<Flex align="center" justify="center">
					<Flex direction="column" align="center" justify="center" gap="6px">
						<Text
							style={{
								fontSize: '14px',
								fontWeight: 'bold',
							}}
						>
							Choose a Trigger
						</Text>
						<Select
							showSearch
							placeholder="Select a Service"
							optionFilterProp="children"
							onChange={onTriggerChange}
							onSearch={onSearch}
							filterOption={filterOption}
							style={InputStyle}
							options={triggerOptions}
						/>
					</Flex>
					<span style={DividerStyle} />
					<PlusCircleOutlined style={{ fontSize: '32px', color: '#757575', padding: '0 5px', marginTop: '24px' }} />
					<span style={DividerStyle} />
					<Flex direction="column" align="center" justify="center" gap="6px">
						<Text
							style={{
								fontSize: '14px',
								fontWeight: 'bold',
							}}
						>
							Choose a Reaction
						</Text>
						<Select
							showSearch
							placeholder="Select a Service"
							optionFilterProp="children"
							onChange={onReactionChange}
							onSearch={onSearch}
							filterOption={filterOption}
							style={InputStyle}
							options={reactionOptions}
						/>
					</Flex>
				</Flex>
			) : null}
			{selectedTrigger && selectedReaction ? (
				<Button
					style={{
						alignItems: 'center',
						width: '200px',
						height: '50px',
						borderRadius: '50px',
						fontSize: '20px',
						fontWeight: 'bold',
					}}
				>
					Try It!
				</Button>
			) : null}
		</>
	);
};

export default AutomationCreation;
