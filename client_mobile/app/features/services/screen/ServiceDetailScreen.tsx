import { Button, ButtonText, ScrollView } from '@gluestack-ui/themed';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../../App';
import { capitalizeFirstLetter } from '../../../core/utils/capitalizeFirstLetter';

type ServiceDetailRouteProp = RouteProp<RootStackParamList, 'ServiceDetailScreen'>;

const ServiceDetailScreen = () => {
  const route = useRoute<ServiceDetailRouteProp>();
  const { service } = route.params;

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
          <Text style={{ fontSize: 22, color: 'white', fontWeight: 'bold' }}>
            {capitalizeFirstLetter(service.name)} Integrations
            {/* TODO : Translation */}
          </Text>
          <Text style={{ color: 'white', fontSize: 14, fontFamily: 'Inter', textAlign: 'center' }}>
            {service.description}
          </Text>
          <Button
            size="md"
            variant="solid"
            action="primary"
            isDisabled={false}
            isFocusVisible={false}
            style={{ borderRadius: 30, width: 119, height: 40, backgroundColor: '#FFF', marginBottom: 10 }}
            onPress={() => console.log('Connect')}>
            <ButtonText style={{ color: 'black', fontSize: 16 }}>Authorize</ButtonText>
            {/* TODO : Translation */}
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
          Trigger & Actions
          {/* TODO : Translation */}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardsContainer: {
    backgroundColor: '#424242',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 250,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
});

export default ServiceDetailScreen;
