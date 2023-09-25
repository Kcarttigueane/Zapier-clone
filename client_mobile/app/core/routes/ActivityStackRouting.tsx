import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import ActivityScreen from '../../features/activity/presentation/screen/ActivityScreen';

const ActivityScreensStack = createNativeStackNavigator<RootStackParamList>();

const ActivityStackRouting = () => {
  return (
    <ActivityScreensStack.Navigator>
      <ActivityScreensStack.Screen name="ActivityScreen" component={ActivityScreen} options={{ headerShown: false }} />
    </ActivityScreensStack.Navigator>
  );
};

export default ActivityStackRouting;
