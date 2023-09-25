import React from 'react';
import './core/i18n/i18next';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from '../tamagui.config';
import HomeStackRouting from './core/routes/HomeStackRouting';
import ServicesStackRouting from './core/routes/ServicesStackRouting';
import SettingsStackRouting from './core/routes/SettingsStackRouting';
import ZapStackRouting from './core/routes/ZapStackRouting';
import CreateZapScreen from './features/zap/presentation/screen/CreateZapScreen';

export type RootStackParamList = {
  // ! Auth:
  Login: undefined;
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

const App = (): JSX.Element => {
  // const isDarkMode = useColorScheme() === 'dark';

  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Home" component={HomeStackRouting} />
          <Tab.Screen name="Activity" component={ZapStackRouting} />
          <Tab.Screen name="Zap" component={CreateZapScreen} />
          <Tab.Screen name="Services" component={ServicesStackRouting} />
          <Tab.Screen name="Settings" component={SettingsStackRouting} options={{ headerShown: false }} />
        </Tab.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
    //   <SafeAreaView style={[backgroundStyle, { flex: 1, backgroundColor: 'white' }]}>
    //     <Slider />
    //   </SafeAreaView>
  );
};

export default App;
