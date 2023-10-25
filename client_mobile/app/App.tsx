import { config, GluestackUIProvider } from '@gluestack-ui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import CustomBottomTabBar from './core/components/CustomBottomNavBar';
import './core/i18n/i18next';
import ActivityStackRouting from './core/routes/ActivityStackRouting';
import AuthStackRouting from './core/routes/AuthStackRouting';
import HomeStackRouting from './core/routes/HomeStackRouting';
import ServicesStackRouting from './core/routes/ServicesStackRouting';
import SettingsStackRouting from './core/routes/SettingsStackRouting';
import ZapStackRouting from './core/routes/ZapStackRouting';
import { Linking } from 'react-native';

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
  // ! Settings:
  SettingsScreen: undefined;
  AppearanceScreen: undefined;
  LanguageScreen: undefined;
  HelpScreen: undefined;
  ProfileScreen: undefined;
  ConnectedServicesScreen: undefined;
};

const Tab = createBottomTabNavigator();

export const handleGoogleOAuth = async () => {
  Linking.openURL('http://0.0.0.0:8080/api/v2/auth/login/mobile/google');
};

export const handleSpotifyOAuth = async () => {
  Linking.openURL('http://0.0.0.0:8080/api/v2/auth/login/mobile/spotify');
};

export const handleGitHubOAuth = async () => {
  Linking.openURL('http://0.0.0.0:8080/api/v2/auth/login/mobile/github');
};

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Gérer l'URL initiale lors du lancement de l'application

    // Gérer les liens profonds lorsqu'ils sont détectés
    const handleDeepLink = (event: { url: string | string[] }) => {
      console.log('Deep link detected:', event.url);
      if (event.url.includes('myapp://oauthredirect')) {
        // Traitez l'authentification Google ici
        console.log('Authentication with Provider');
        setIsLoggedIn(true);
      }
    };

    // Ajouter un gestionnaire pour les liens profonds
    (Linking as any).addEventListener('url', handleDeepLink);

    // Nettoyer les gestionnaires lors du démontage du composant
    return () => {
      (Linking as any).removeEventListener('url', handleDeepLink);
    };
  }, []);

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
