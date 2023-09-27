import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import LoginScreen from '../../features/auth/presentation/screen/LoginScreen';
import RegisterScreen from '../../features/auth/presentation/screen/RegisterScreen';

const AuthScreensStack = createNativeStackNavigator<RootStackParamList>();

const AuthStackRouting = () => {
  return (
    <AuthScreensStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <AuthScreensStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthScreensStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
    </AuthScreensStack.Navigator>
  );
};

export default AuthStackRouting;
