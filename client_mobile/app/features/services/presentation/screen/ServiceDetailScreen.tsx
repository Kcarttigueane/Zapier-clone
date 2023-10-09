import { Button, ButtonText, ScrollView } from '@gluestack-ui/themed';
import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const Cards = ({ service1, service2, message }: { service1: string; service2: string; message: string }) => {
  interface ServiceImages {
    [key: string]: any;
  }

  const serviceImages: ServiceImages = {
    Gmail: require('../../../../core/assets/gmail.png'),
    Tinder: require('../../../../core/assets/tinder.png'),
    Facebook: require('../../../../core/assets/facebook.png'),
    Spotify: require('../../../../core/assets/spotify.png'),
    Drive: require('../../../../core/assets/google_drive.png'),
    Calendar: require('../../../../core/assets/google_calendar.png'),
    Apple: require('../../../../core/assets/apple.png'),
    Discord: require('../../../../core/assets/discord.png'),
    Reddit: require('../../../../core/assets/reddit.png'),
    Signal: require('../../../../core/assets/signal.png'),
    Weater: require('../../../../core/assets/weater.png'),
    WhatsApp: require('../../../../core/assets/whatApps.png'),
    Youtube: require('../../../../core/assets/ytb.png'),
    Twitter: require('../../../../core/assets/X.png'),
  };

  return (
    <View
      style={{
        width: '90%',
        height: 150,
        elevation: 5,
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 20,
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

const ServiceDetailScreen = () => {
  const route: any = useRoute();
  const title = route.params.title;

  return (
    <View>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#616161', textAlign: 'center', marginTop: 10 }}>
          Service {title}
        </Text>
        <View style={styles.cardsContainer}>
          <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold', fontFamily: 'Inter' }}>
            {title} integrations
          </Text>
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Inter', textAlign: 'center' }}>
            Whether you're part of a school club, gaming group, worldwide art community, or just a handful of friends
            that want to spend time together, Discord makes it easy to talk every day and hang out more often.
          </Text>
          <Button
            size="md"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
            style={{ borderRadius: 30, width: 119, height: 40, backgroundColor: '#FFF', marginBottom: 10 }}>
            <ButtonText style={{ color: 'black', fontSize: 16 }}>Connect</ButtonText>
          </Button>
        </View>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            fontFamily: 'Inter',
            textAlign: 'center',
            marginVertical: 50,
            fontWeight: 'bold',
          }}>
          Popular {title} workflows & automation
        </Text>
        <Cards service1={title} service2="Facebook" message="Add new leads to an email list" />
        <Cards service1={title} service2="Spotify" message="Share playlist on server" />
        <Cards service1={title} service2="Weater" message="Add weather rapport on drive" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    width: '90%',
    backgroundColor: '#7289DA',
    borderRadius: 10,
    height: 250,
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default ServiceDetailScreen;
