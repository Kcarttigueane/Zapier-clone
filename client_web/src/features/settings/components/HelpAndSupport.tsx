import { Select, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslation } from 'react-i18next';

const containerStyle: React.CSSProperties = {
	border: '1px solid #d9d9d9',
	padding: '60px 140px',
	borderRadius: '12px',
};

const HelpAndSupport = () => {

	const { t } = useTranslation();
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
				placeholder={t('settings.settingScreen.help.description')}
				optionFilterProp="children"
				onChange={onSelectChange}
				onSearch={onSearch}
				filterOption={filterOption}
				options={[
					{
						value: 'bug',
						label: t('settings.settingScreen.help.bug'),
					},
					{
						value: 'feature',
						label: t('settings.settingScreen.help.feature'),
					},
					{
						value: 'questions',
						label: t('settings.settingScreen.help.question'),
					},
					{
						value: 'others',
						label: t('settings.settingScreen.help.other'),
					},
				]}
			/>
			<TextArea
				showCount
				maxLength={100}
				onChange={onInputChange}
				style={{ height: 120, resize: 'none' }}
				placeholder={t('settings.settingScreen.help.textAreaPlaceholder')}
			/>
		</Space>
	);
};

export default HelpAndSupport;
