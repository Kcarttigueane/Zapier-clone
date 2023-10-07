import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import ActivityScreen from '../../features/activity/presentation/screen/ActivityScreen';

const ZapScreensStack = createNativeStackNavigator<RootStackParamList>();

const ZapStackRouting = () => {
  return (
    <ZapScreensStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <ZapScreensStack.Screen name="CreateZapScreen" component={ActivityScreen} options={{ headerShown: false }} />
    </ZapScreensStack.Navigator>
  );
};

export default ZapStackRouting;
