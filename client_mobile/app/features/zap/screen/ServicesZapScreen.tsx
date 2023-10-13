import { ScrollView } from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ZapScreenNavigationProp } from '../screen/CreateZapScreen';

import ServiceZapCard from '../components/ServiceZapCard';
import ZapSearchBar from '../components/ZapSearchBar';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../../App';

const cardsData = [
  { title: 'Gmail', logo: require('../../../core/assets/gmail.png') },
  { title: 'Tinder', logo: require('../../../core/assets/tinder.png') },
  { title: 'Spotify', logo: require('../../../core/assets/spotify.png') },
  { title: 'Drive', logo: require('../../../core/assets/google_drive.png') },
  { title: 'Reddit', logo: require('../../../core/assets/reddit.png') },
  { title: 'Twitter', logo: require('../../../core/assets/X.png') },
  { title: 'Calendar', logo: require('../../../core/assets/google_calendar.png') },
  { title: 'Google', logo: require('../../../core/assets/google.png') },
  { title: 'Signal', logo: require('../../../core/assets/signal.png') },
  { title: 'Weater', logo: require('../../../core/assets/weater.png') },
  { title: 'WhatsApp', logo: require('../../../core/assets/whatApps.png') },
  { title: 'Youtube', logo: require('../../../core/assets/ytb.png') },
];

type ZapServiceProps = {
  navigation: ZapScreenNavigationProp;
};

type ServiceDetailRouteProp = RouteProp<RootStackParamList, 'ServicesZapScreen'>;

const ServicesZapScreen = ({ navigation }: ZapServiceProps) => {
  const [filteredCards, setFilteredCards] = useState(cardsData);
  const [searchText, setSearchText] = useState('');
  const route = useRoute<ServiceDetailRouteProp>();
  const { isTrigger } = route.params;
  console.log(isTrigger);

  useEffect(() => {
    const filtered = cardsData.filter(card => card.title.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredCards(filtered);
  }, [searchText]);

  return (
    <SafeAreaView style={styles.container}>
      <ZapSearchBar onChangeText={setSearchText} value={searchText} />
      <ScrollView contentContainerStyle={styles.cardsContainer} showsVerticalScrollIndicator={false}>
        {filteredCards.map((data, index) => (
          <ServiceZapCard key={index} item={data} navigation={navigation} isTrigger={isTrigger} />
        ))}
        <View style={{ height: 100, width: 1000 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 20,
  },
});

export default ServicesZapScreen;
