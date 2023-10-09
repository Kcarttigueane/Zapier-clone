import { Button, ButtonText, ScrollView } from '@gluestack-ui/themed';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import ServiceAutomationCard from '../components/ServiceAutomationCard';

type ServiceDetailRouteProp = RouteProp<RootStackParamList, 'ServiceDetailScreen'>;

const ServiceDetailScreen = () => {
  const route = useRoute<ServiceDetailRouteProp>();
  const { title } = route.params;

  return (
    <SafeAreaView>
      <ScrollView
        contentContainerStyle={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          paddingBottom: 50,
        }}>
        <View style={styles.cardsContainer}>
          <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>{title} integrations</Text>
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
            fontWeight: 'bold',
          }}>
          Popular {title} workflows & automation
        </Text>
        <ServiceAutomationCard service1={title} service2="Facebook" message="Add new leads to an email list" />
        <ServiceAutomationCard service1={title} service2="Spotify" message="Share playlist on server" />
        <ServiceAutomationCard service1={title} service2="Weater" message="Add weather rapport on drive" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    backgroundColor: '#7289DA',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 250,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

export default ServiceDetailScreen;
