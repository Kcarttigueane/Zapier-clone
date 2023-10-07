import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import HomeScreen from '../../features/home/presentation/screen/HomeScreen';

const HomeScreensStack = createNativeStackNavigator<RootStackParamList>();

const HomeStackRouting = () => {
  return (
    <HomeScreensStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <HomeScreensStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
    </HomeScreensStack.Navigator>
  );
};

export default HomeStackRouting;
