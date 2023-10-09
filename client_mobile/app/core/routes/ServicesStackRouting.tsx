import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import ServiceDetailScreen from '../../features/services/screen/ServiceDetailScreen';
import ServicesScreen from '../../features/services/screen/ServicesScreen';

const ServicesScreensStack = createNativeStackNavigator<RootStackParamList>();

const ServicesStackRouting = () => {
  return (
    <ServicesScreensStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <ServicesScreensStack.Screen name="ServicesScreen" component={ServicesScreen} options={{ headerShown: false }} />
      <ServicesScreensStack.Screen
        name="ServiceDetailScreen"
        component={ServiceDetailScreen}
        options={{ headerShown: true }}
      />
    </ServicesScreensStack.Navigator>
  );
};

export default ServicesStackRouting;
