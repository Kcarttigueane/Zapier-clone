import { config, GluestackUIProvider } from '@gluestack-ui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useState } from 'react';
import CustomBottomTabBar from './core/components/CustomBottomNavBar';
import './core/i18n/i18next';
import AuthStackRouting from './core/routes/AuthStackRouting';
import HomeStackRouting from './core/routes/HomeStackRouting';
import ServicesStackRouting from './core/routes/ServicesStackRouting';
import SettingsStackRouting from './core/routes/SettingsStackRouting';
import ZapStackRouting from './core/routes/ZapStackRouting';
import CreateZapScreen from './features/zap/presentation/screen/CreateZapScreen';

export type RootStackParamList = {
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
  ServiceDetailScreen: undefined;
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
            <Tab.Screen name="Activity" component={ZapStackRouting} options={{ headerShown: false }} />
            <Tab.Screen name="Zap" component={CreateZapScreen} />
            <Tab.Screen name="Services" component={ServicesStackRouting} />
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
