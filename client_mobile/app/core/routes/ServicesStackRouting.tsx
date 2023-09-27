import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import ServiceDetailScreen from '../../features/services/presentation/screen/ServiceDetailScreen';
import ServicesScreen from '../../features/services/presentation/screen/ServicesScreen';

const ServicesScreensStack = createNativeStackNavigator<RootStackParamList>();

const ServicesStackRouting = () => {
  return (
    <ServicesScreensStack.Navigator>
      <ServicesScreensStack.Screen name="ServicesScreen" component={ServicesScreen} options={{ headerShown: false }} />
      <ServicesScreensStack.Screen
        name="ServiceDetailScreen"
        component={ServiceDetailScreen}
        options={{ headerShown: false }}
      />
    </ServicesScreensStack.Navigator>
  );
};

export default ServicesStackRouting;
