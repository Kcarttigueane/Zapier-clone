import { config, GluestackUIProvider } from '@gluestack-ui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import CustomBottomTabBar from './core/components/CustomBottomNavBar';
import './core/i18n/i18next';
import ActivityStackRouting from './core/routes/ActivityStackRouting';
import AuthStackRouting from './core/routes/AuthStackRouting';
import HomeStackRouting from './core/routes/HomeStackRouting';
import ServicesStackRouting from './core/routes/ServicesStackRouting';
import SettingsStackRouting from './core/routes/SettingsStackRouting';
import ZapStackRouting from './core/routes/ZapStackRouting';

type ImageRequireType = ReturnType<typeof require>;

export type RootStackParamList = {
  // ! Demo
  Demo: undefined;
  // ! Auth:
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  // ! Home:
  HomeScreen: undefined;
  // ! Activity:
  ActivityScreen: undefined;
  // ! Zap:
  CreateZapScreen: undefined;
  // ! Services:
  ServicesScreen: undefined;
  ServiceDetailScreen: {
    title: string;
  };
  ZapReactionScreen: {
    logo: ImageRequireType;
  };
  // ! Settings:
  SettingsScreen: undefined;
  AppearanceScreen: undefined;
  LanguageScreen: undefined;
  HelpScreen: undefined;
  ProfileScreen: undefined;
  ConnectedServicesScreen: undefined;
};

const Tab = createBottomTabNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <GluestackUIProvider config={config.theme}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Tab.Navigator tabBar={props => <CustomBottomTabBar {...props} />}>
            <Tab.Screen name="Home" component={HomeStackRouting} options={{ headerShown: false }} />
            <Tab.Screen name="Activity" component={ActivityStackRouting} options={{ headerShown: false }} />
            <Tab.Screen name="Zap" component={ZapStackRouting} options={{ headerShown: false }} />
            <Tab.Screen name="Services" component={ServicesStackRouting} options={{ headerShown: false }} />
            <Tab.Screen name="Settings" component={SettingsStackRouting} options={{ headerShown: false }} />
          </Tab.Navigator>
        ) : (
          <AuthStackRouting />
        )}
      </NavigationContainer>
    </GluestackUIProvider>
  );
};

export default App;
