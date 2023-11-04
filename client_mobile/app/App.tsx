import { config, GluestackUIProvider, Spinner } from '@gluestack-ui/themed';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React, { useCallback, useEffect } from 'react';
import { Linking } from 'react-native';
import { getAccessToken, setAccessToken } from './core/api';
import CustomBottomTabBar from './core/components/CustomBottomNavBar';
import './core/i18n/i18next';
import { ServiceModelDTO } from './core/models/service';
import ActivityStackRouting from './core/routes/ActivityStackRouting';
import AuthStackRouting from './core/routes/AuthStackRouting';
import HomeStackRouting from './core/routes/HomeStackRouting';
import ServicesStackRouting from './core/routes/ServicesStackRouting';
import SettingsStackRouting from './core/routes/SettingsStackRouting';
import ZapStackRouting from './core/routes/ZapStackRouting';
import { useAuthStore } from './core/zustand/useAuthStore';
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
  const { isLoading, isLoggedIn, setLoggedIn, logoutFn } = useAuthStore(state => state);
  const { fetchCurrentUser, isUserLoading } = useUserStore(state => state);

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

  const checkTokenAndFetchUser = useCallback(async () => {
    let tokenFromStorage = await getAccessToken();
    if (tokenFromStorage) {
      try {
        await fetchCurrentUser(tokenFromStorage).then(() => setLoggedIn(true));
      } catch (error) {
        logoutFn();
        console.error('Logging out because - Error fetching current user:', error);
      }
    } else {
      logoutFn();
      console.info('Logging out - no token found in storage');
    }
  }, [fetchCurrentUser, logoutFn, setLoggedIn]);

  useEffect(() => {
    const handleDeepLink = async (event: { url?: string; nativeEvent?: { data?: string; url?: string } }) => {
      const actualURL = event.url || event.nativeEvent?.url || event.nativeEvent?.data;
      console.log('Deep link detected:', actualURL);

      if (actualURL && actualURL.includes('myapp://oauthredirect')) {
        const tokenFromURL = getQueryParam(actualURL, 'token');
        if (tokenFromURL) {
          console.info('Token from deep link:', tokenFromURL);
          await setAccessToken(tokenFromURL);
          try {
            await fetchCurrentUser(tokenFromURL).then(() => setLoggedIn(true));
          } catch (error) {
            logoutFn();
            console.error('Error fetching current user with token from deep link:', error);
          }
        }
      }
    };

    checkTokenAndFetchUser();

    const subscription = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(initialUrl => {
      if (initialUrl) {
        console.info('Initial URL is:', initialUrl);
        handleDeepLink({ url: initialUrl });
      }
    });

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [checkTokenAndFetchUser, fetchCurrentUser, logoutFn, setLoggedIn]);

  return (
    <GluestackUIProvider config={config.theme}>
      {isLoading || (isUserLoading && <Spinner accessibilityLabel="Loading..." size="large" />)}
      <NavigationContainer>
        {isLoggedIn ? (
          // eslint-disable-next-line react/no-unstable-nested-components
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
