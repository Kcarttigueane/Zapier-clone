import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import CreateZapScreen from '../../features/zap/presentation/screen/CreateZapScreen';
import ActivityScreen from '../../features/activity/presentation/screen/ActivityScreen';

const ZapScreensStack = createNativeStackNavigator<RootStackParamList>();

const ZapStackRouting = () => {
  return (
    <ZapScreensStack.Navigator>
      <ZapScreensStack.Screen name="CreateZapScreen" component={ActivityScreen} options={{ headerShown: false }} />
    </ZapScreensStack.Navigator>
  );
};

export default ZapStackRouting;
