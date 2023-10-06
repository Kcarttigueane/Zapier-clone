import { Button, ButtonText, ScrollView } from '@gluestack-ui/themed';
import React from 'react';
import { Text, View } from 'react-native';

const Cards = () => {
  return(
    <View style={{width: '90%', height: 150, elevation: 5, backgroundColor: 'white', borderRadius: 15, marginBottom: 20}}></View>
  );
}

const ServiceDetailScreen = ({ title }: { title: string }) => {
  return (
    <View>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#616161', textAlign: 'center', marginTop: 10 }}>
        Title Service
      </Text>
      <View
        style={{
          width: '90%',
          backgroundColor: '#7289DA',
          borderRadius: 10,
          height: 250,
          marginTop: 30,
          paddingVertical: 10,
          paddingHorizontal: 30,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold', fontFamily: 'Inter' }}>
          Title integrations
        </Text>
        <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Inter', textAlign: 'center' }}>
          Whether you're part of a school club, gaming group, worldwide art community, or just a handful of friends that
          want to spend time together, Discord makes it easy to talk every day and hang out more often.
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
      <Text style={{color: 'black', fontSize: 16, fontFamily: 'Inter', textAlign: 'center', marginVertical: 50, fontWeight: 'bold'}}>Popular Title workflows & automation</Text>
      <Cards />
      <Cards />
      <Cards />
      </ScrollView>
    </View>
  );
};

export default ServiceDetailScreen;
