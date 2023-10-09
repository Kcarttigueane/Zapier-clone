import { Image, Text } from '@gluestack-ui/themed';
import React from 'react';
import { View } from 'react-native';

interface ServiceImages {
  [key: string]: any;
}

const serviceImages: ServiceImages = {
  Gmail: require('../../../core/assets/gmail.png'),
  Tinder: require('../../../core/assets/tinder.png'),
  Facebook: require('../../../core/assets/facebook.png'),
  Spotify: require('../../../core/assets/spotify.png'),
  Drive: require('../../../core/assets/google_drive.png'),
  Calendar: require('../../../core/assets/google_calendar.png'),
  Apple: require('../../../core/assets/apple.png'),
  Discord: require('../../../core/assets/discord.png'),
  Reddit: require('../../../core/assets/reddit.png'),
  Signal: require('../../../core/assets/signal.png'),
  Weater: require('../../../core/assets/weater.png'),
  WhatsApp: require('../../../core/assets/whatApps.png'),
  Youtube: require('../../../core/assets/ytb.png'),
  Twitter: require('../../../core/assets/X.png'),
};

const ServiceAutomationCard = ({
  service1,
  service2,
  message,
}: {
  service1: string;
  service2: string;
  message: string;
}) => {
  return (
    <View
      style={{
        width: '90%',
        height: 150,
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        paddingTop: 20,
        overflow: 'hidden',
      }}>
      <View style={{ flexDirection: 'row', gap: 15, marginBottom: 10, marginLeft: 20 }}>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: '#FFF',
            padding: 5,
            borderColor: '#E8E7E4',
            borderWidth: 2,
          }}>
          <Image style={{ width: '100%', height: '100%' }} resizeMode="cover" source={serviceImages[service1]} />
        </View>
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 10,
            backgroundColor: '#FFF',
            padding: 5,
            borderColor: '#E8E7E4',
            borderWidth: 2,
          }}>
          <Image style={{ width: '100%', height: '100%' }} resizeMode="cover" source={serviceImages[service2]} />
        </View>
      </View>
      <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 16, fontWeight: 'bold', color: 'black' }}>
        {message}
      </Text>
      <View style={{ flex: 1, backgroundColor: '#BDBDBD', justifyContent: 'center' }}>
        <Text style={{ marginLeft: 15, color: 'black', fontSize: 14, fontWeight: '500', fontFamily: 'Inter' }}>
          {service1} + {service2}
        </Text>
      </View>
    </View>
  );
};

export default ServiceAutomationCard;
