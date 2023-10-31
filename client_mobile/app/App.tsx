import { config, GluestackUIProvider } from '@gluestack-ui/themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect, useState } from 'react';
import { Linking, Text } from 'react-native';
import CustomBottomTabBar from './core/components/CustomBottomNavBar';
import './core/i18n/i18next';
import { ServiceModelDTO } from './core/models/service';
import ActivityStackRouting from './core/routes/ActivityStackRouting';
import AuthStackRouting from './core/routes/AuthStackRouting';
import HomeStackRouting from './core/routes/HomeStackRouting';
import ServicesStackRouting from './core/routes/ServicesStackRouting';
import SettingsStackRouting from './core/routes/SettingsStackRouting';
import ZapStackRouting from './core/routes/ZapStackRouting';
import useUserStore from './core/zustand/useUserStore';

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
  ServicesZapScreen: undefined;
  ZapTriggerScreen: undefined;
  ZapReactionScreen: undefined;
  // ! Services:
  ServicesScreen: undefined;
  ServiceDetailScreen: {
    service: ServiceModelDTO;
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { fetchCurrentUser, isLoading } = useUserStore(state => state);

  const getQueryParam = (url: string, param: string) => {
    const regex = new RegExp(`[?&]${param}(=([^&#]*)|&|#|$)`),
      results = regex.exec(url);
    if (!results) {
      return null;
    }
    if (!results[2]) {
      return '';
    }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };

  const checkUserToken = useCallback(async () => {
    let tokenFromStorage = await AsyncStorage.getItem('access_token');
    if (tokenFromStorage) {
      try {
        await fetchCurrentUser(tokenFromStorage).then(() => setIsLoggedIn(true));
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    } else {
      setIsLoggedIn(false); // Set isLoggedIn to false if token is not found
    }
  }, [fetchCurrentUser]);

  useEffect(() => {
    const handleDeepLink = async (event: { url?: string; nativeEvent?: { data?: string; url?: string } }) => {
      const actualURL = event.url || event.nativeEvent?.url || event.nativeEvent?.data;
      console.log('Deep link detected:', actualURL);

      if (actualURL && actualURL.includes('myapp://oauthredirect')) {
        const tokenFromURL = getQueryParam(actualURL, 'token');
        if (tokenFromURL) {
          console.log('Token from deep link:', tokenFromURL);
          await AsyncStorage.setItem('access_token', tokenFromURL);
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    checkUserToken();

    return () => {
      Linking.removeAllListeners('url');
    };
  }, [checkUserToken]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <GluestackUIProvider config={config.theme}>
      <NavigationContainer>
        {isLoggedIn ? (
          <Tab.Navigator tabBar={props => <CustomBottomTabBar {...props} />}>
            <>
              <Tab.Screen name="Home" component={HomeStackRouting} options={{ headerShown: false }} />
              <Tab.Screen name="Activity" component={ActivityStackRouting} options={{ headerShown: false }} />
              <Tab.Screen name="Zap" component={ZapStackRouting} options={{ headerShown: false }} />
              <Tab.Screen name="Services" component={ServicesStackRouting} options={{ headerShown: false }} />
              <Tab.Screen name="Settings" component={SettingsStackRouting} options={{ headerShown: false }} />
            </>
          </Tab.Navigator>
        ) : (
          <AuthStackRouting />
        )}
      </NavigationContainer>
    </GluestackUIProvider>
  );
};

export default App;
