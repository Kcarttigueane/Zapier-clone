import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import ActivityScreen from '../../features/activity/screen/ActivityScreen';

const ActivityScreensStack = createNativeStackNavigator<RootStackParamList>();

const ActivityStackRouting = () => {
  return (
    <ActivityScreensStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <ActivityScreensStack.Screen name="ActivityScreen" component={ActivityScreen} options={{ headerShown: false }} />
    </ActivityScreensStack.Navigator>
  );
};

export default ActivityStackRouting;
