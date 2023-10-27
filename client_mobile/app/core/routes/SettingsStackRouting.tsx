import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../../App';
import AppearanceScreen from '../../features/settings/screens/AppearanceScreen';
import ConnectedServices from '../../features/settings/screens/ConnectedServices';
import Help from '../../features/settings/screens/Help';
import LanguageScreen from '../../features/settings/screens/LanguageScreen';
import ProfileScreen from '../../features/settings/screens/ProfileScreen';
import SettingsScreen from '../../features/settings/screens/SettingsScreen';
import { useAuthStore } from '../zustand/useAuthStore';

const SettingsScreensStack = createNativeStackNavigator<RootStackParamList>();

const generateHeaderTitle = (title: string) => () =>
  (
    <Text
      style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#616161',
      }}>
      {title}
    </Text>
  );

const SettingsStackRouting = () => {
  const { t } = useTranslation();
  const logoutFn = useAuthStore(state => state.logoutFn);

  const logoutButton = (
    <View style={{ marginRight: 10 }}>
      <TouchableOpacity onPress={logoutFn}>
        <MaterialCommunityIcons name="logout" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SettingsScreensStack.Navigator
      screenOptions={{
        headerTintColor: '#616161',
        headerTitleAlign: 'center',
        headerStyle: {},
        contentStyle: {
          backgroundColor: 'white',
        },
      }}>
      <SettingsScreensStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          headerTitle: generateHeaderTitle(t('settings.headerTitle')),
          headerRight: () => logoutButton,
        }}
      />
      <SettingsScreensStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerTitle: generateHeaderTitle(t('settings.settingScreen.profile.title')),
        }}
      />
      <SettingsScreensStack.Screen
        name="AppearanceScreen"
        component={AppearanceScreen}
        options={{ headerTitle: generateHeaderTitle(t('settings.settingScreen.appearance.title')) }}
      />
      <SettingsScreensStack.Screen
        name="LanguageScreen"
        component={LanguageScreen}
        options={{ headerTitle: generateHeaderTitle(t('settings.settingScreen.language.title')) }}
      />
      <SettingsScreensStack.Screen
        name="ConnectedServicesScreen"
        component={ConnectedServices}
        options={{ headerTitle: generateHeaderTitle(t('settings.settingScreen.connectedServices.title')) }}
      />
      <SettingsScreensStack.Screen
        name="HelpScreen"
        component={Help}
        options={{ headerTitle: generateHeaderTitle(t('settings.settingScreen.help.title')) }}
      />
    </SettingsScreensStack.Navigator>
  );
};

export default SettingsStackRouting;
