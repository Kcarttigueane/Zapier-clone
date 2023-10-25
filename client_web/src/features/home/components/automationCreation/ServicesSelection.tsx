import { PlusCircleOutlined } from '@ant-design/icons';
import { Image, Select, Spin, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import Flex from '../../../../core/components/Flex';

import { FC, useEffect } from 'react';
import { ServiceModelDTO } from '../../../../core/models/service';
import useServicesStore from '../../../../core/zustand/useServiceStore';

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

const servicesOptions = (services: ServiceModelDTO[]) => {
	return services.map((service) => ({
		value: JSON.stringify({ id: service.id, name: service.name }),
		label: (
			<div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
				<Image
					src={`data:image/svg+xml;base64,${service.icon_svg_base64}`}
					preview={false}
					alt="Google Drive icon"
					style={{ width: '25px', marginRight: '8px' }}
				/>
				{service.name}
			</div>
		),
	}));
};

interface ServicesSelectionProps {
	selectedService1: string | null;
	setSelectedService1: (value: string) => void;
	selectedService2: string | null;
	setSelectedService2: (value: string) => void;
}

const ServicesSelection: FC<ServicesSelectionProps> = ({
	selectedService1,
	setSelectedService1,
	selectedService2,
	setSelectedService2,
}) => {
	const { t } = useTranslation();
	const { services, fetchCompatibleServices, isLoading, compatibleServices } = useServicesStore((state) => state);

	const serviceOptions1: any = servicesOptions(services ?? []);

	const filterOption = (input: string, option?: { label: string; value: string }) => {
		const parsedValue = JSON.parse(option?.value || '{}');
		return (parsedValue.name ?? '').toLowerCase().includes(input.toLowerCase());
	};

	useEffect(() => {
		if (selectedService1) {
			console.log('selectedService1', selectedService1);
			fetchCompatibleServices(selectedService1);
		}
	}, [selectedService1]);

	return (
		<>
			<Text style={TitleStyle}>{t('home.create.title')}</Text>
			<Flex align="center" justify="center">
				<Flex direction="column" align="center" justify="center" gap="6px">
					<Text strong>{t('home.create.action1')}</Text>
					<Select
						showSearch
						value={selectedService1}
						placeholder={t('home.create.service')}
						optionFilterProp="children"
						onChange={(option) => {
							const parsedValue = JSON.parse(option.value); // TODO: check the error but working
							const serviceId = parsedValue.id;
							console.log('serviceId', serviceId);
							setSelectedService1(serviceId);
						}}
						labelInValue
						// onSearch={onSearch}
						filterOption={filterOption}
						style={InputStyle}
						options={serviceOptions1}
						notFoundContent="No service found"
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
						{t('home.create.reaction1')}
					</Text>
					{isLoading ? (
						<Spin />
					) : (
						<Select
							showSearch
							value={selectedService2}
							placeholder={t('home.create.service')}
							optionFilterProp="children"
							onChange={(value) => console.log('value', value)}
							// onSearch={onSearch}
							filterOption={filterOption}
							style={InputStyle}
							options={servicesOptions(compatibleServices) as any}
						/>
					)}
				</Flex>
			</Flex>
		</>
	);
};

export default ServicesSelection;
