import React, { FC } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Base64SvgDisplay from '../../../core/components/Base64SvgDisplay';
import { ServiceModelDTO } from '../../../core/models/service';
import { capitalizeFirstLetter } from '../../../core/utils/capitalizeFirstLetter';
import { ServicesScreenNavigationProp } from '../screen/ServicesScreen';

type ServiceCardProps = {
  service: ServiceModelDTO;
  navigation: ServicesScreenNavigationProp;
};

const ServiceCard: FC<ServiceCardProps> = ({ service, navigation }) => {
  const handleDetails = () => navigation.navigate('ServiceDetailScreen', { service: service });

  return (
    <TouchableOpacity onPress={handleDetails} style={styles.cards}>
      <Base64SvgDisplay base64Svg={service.icon_svg_base64} width={64} height={64} />
      <Text style={{ fontSize: 16, color: 'black', fontWeight: '700', marginTop: 20 }}>
        {capitalizeFirstLetter(service.name)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cards: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    height: 150,
    elevation: 4,
    backgroundColor: '#FFF',
    borderRadius: 20,
    marginTop: 10,
  },
});

export default ServiceCard;
