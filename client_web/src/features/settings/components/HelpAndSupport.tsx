import { Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';

const containerStyle: React.CSSProperties = {
	border: '1px solid #d9d9d9',
	padding: '60px 140px',
	borderRadius: '12px',
};

const HelpAndSupport = () => {
	const onSelectChange = (value: string) => {
		console.log(`selected ${value}`);
	};

	const onSearch = (value: string) => {
		console.log('search:', value);
	};

	const filterOption = (input: string, option?: { label: string; value: string }) =>
		(option?.label ?? '').toLowerCase().includes(input.toLowerCase());

	const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		console.log('Change:', e.target.value);
	};

	return (
		<Space direction="vertical" size={32} style={containerStyle}>
			<Select
				style={{ width: 400 }}
				showSearch
				placeholder="What king of help do you need?"
				optionFilterProp="children"
				onChange={onSelectChange}
				onSearch={onSearch}
				filterOption={filterOption}
				options={[
					{
						value: 'bug',
						label: 'Bug',
					},
					{
						value: 'feature',
						label: 'Features Suggestions',
					},
					{
						value: 'questions',
						label: 'Questions',
					},
					{
						value: 'others',
						label: 'Others',
					},
				]}
			/>
			<TextArea
				showCount
				maxLength={100}
				onChange={onInputChange}
				style={{ height: 120, resize: 'none' }}
				placeholder="Add Tinder as a service"
			/>
		</Space>
	);
};

export default HelpAndSupport;
