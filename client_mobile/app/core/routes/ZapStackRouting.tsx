import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import CreateZapScreen from '../../features/zap/screen/CreateZapScreen';
import ServicesZapScreen from '../../features/zap/screen/ServicesZapScreen';
import ReactionZap from '../../features/zap/screen/ReactionZap';
import TriggerZap from '../../features/zap/screen/TriggerZap';

const ZapScreensStack = createNativeStackNavigator<RootStackParamList>();

const ZapStackRouting = () => {
  return (
    <ZapScreensStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <ZapScreensStack.Screen name="CreateZapScreen" component={CreateZapScreen} options={{ headerShown: false }} />
      <ZapScreensStack.Screen name="ServicesZapScreen" component={ServicesZapScreen} options={{ headerShown: false }} />
      <ZapScreensStack.Screen name="ZapTriggerScreen" component={TriggerZap} options={{ headerShown: false }} />
      <ZapScreensStack.Screen name="ZapReactionScreen" component={ReactionZap} options={{ headerShown: false }} />
    </ZapScreensStack.Navigator>
  );
};

export default ZapStackRouting;
