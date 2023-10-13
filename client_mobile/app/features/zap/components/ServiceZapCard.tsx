import React, { FC } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { ZapScreenNavigationProp } from '../screen/CreateZapScreen';

type ImageRequireType = ReturnType<typeof require>;

type ZapCardProps = {
  item: { title: string; logo: ImageRequireType };
  navigation: ZapScreenNavigationProp;
};

const ServiceZapCard: FC<ZapCardProps> = ({ item: { title, logo }, navigation }) => {
  const handleDetails = () => navigation.navigate('ZapTriggerScreen', { logo });

  return (
    <TouchableOpacity onPress={handleDetails} style={styles.cards}>
      <Image style={{ width: '60%', height: '50%' }} source={logo} alt={title} />
      <Text style={{ fontSize: 16, color: 'black', fontWeight: '800', marginTop: 20 }}>{title}</Text>
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
    elevation: 5,
    backgroundColor: '#FFF',
    borderRadius: 20,
  },
});

export default ServiceZapCard;
