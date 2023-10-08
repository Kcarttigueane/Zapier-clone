import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { RootStackParamList } from '../../App';
import ForgotPasswordScreen from '../../features/auth/screen/ForgotPasswordScreen';
import LoginScreen from '../../features/auth/screen/LoginScreen';
import RegisterScreen from '../../features/auth/screen/RegisterScreen';
import Slider from '../../features/demo/components/Slider';

const AuthScreensStack = createNativeStackNavigator<RootStackParamList>();

const AuthStackRouting = () => {
  return (
    <AuthScreensStack.Navigator
      screenOptions={{
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <AuthScreensStack.Screen name="Demo" component={Slider} options={{ headerShown: false }} />
      <AuthScreensStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <AuthScreensStack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <AuthScreensStack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
    </AuthScreensStack.Navigator>
  );
};

export default AuthStackRouting;
