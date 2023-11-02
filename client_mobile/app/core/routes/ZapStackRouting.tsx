import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import CreateAutomationScreen from '../../features/zap/screen/CreateAutomationScreen';

const ZapScreensStack = createNativeStackNavigator<RootStackParamList>();

const ZapStackRouting = () => {
  return (
    <ZapScreensStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <ZapScreensStack.Screen
        name="CreateZapScreen"
        component={CreateAutomationScreen}
        options={{ headerShown: false }}
      />
    </ZapScreensStack.Navigator>
  );
};

export default ZapStackRouting;
