import { ScrollView, Spinner } from '@gluestack-ui/themed';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../../App';

import useServicesStore from '../../../core/zustand/useServiceStore';
import ServiceCard from '../components/ServiceCard';

type ServicesScreenRouteProp = RouteProp<RootStackParamList, 'ServicesScreen'>;
export type ServicesScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ServicesScreen'>;
type ServicesScreenProps = {
  route: ServicesScreenRouteProp;
  navigation: ServicesScreenNavigationProp;
};

const ServicesScreen = ({ navigation }: ServicesScreenProps) => {
  const { services, fetchServices, isLoading } = useServicesStore(state => state);

  useEffect(() => {
    if (!services.length) {
      try {
        fetchServices();
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    }
  }, [fetchServices, services]);

  if (isLoading) {
    <Spinner size="large" />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.cardsContainer} showsVerticalScrollIndicator={false}>
        {services.map((data, index) => (
          <ServiceCard key={index} service={data} navigation={navigation} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    flexWrap: 'wrap',
    gap: 20,
    paddingBottom: 12,
  },
});

export default ServicesScreen;
