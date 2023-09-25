import { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Cloud, Moon, Star, Sun } from '@tamagui/lucide-icons';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, SectionList, StyleSheet, Text, View } from 'react-native';
import { Avatar, XStack, YStack } from 'tamagui';
import { RootStackParamList } from '../../../../App';
import TabItem from '../components/TabItem';

type SettingsScreenRouteProp = RouteProp<RootStackParamList, 'SettingsScreen'>;
type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SettingsScreen'>;
type SettingsScreenProps = {
  route: SettingsScreenRouteProp;
  navigation: SettingsScreenNavigationProp;
};

type DataItem = {
  title: string;
  description: string;
  route: string;
  icon: React.ReactNode;
};

interface ISettingsData {
  headerTitle: string;
  data: DataItem[];
}

const settingsData = (t: TFunction): ISettingsData[] => [
  {
    headerTitle: t('settings.settingScreen.sectionHeader1'),
    data: [
      {
        title: t('settings.settingScreen.profile.title'),
        description: t('settings.settingScreen.profile.description'),
        route: 'ProfileScreen',
        icon: <Star />,
      },
      {
        title: t('settings.settingScreen.appearance.title'),
        description: t('settings.settingScreen.appearance.description'),
        route: 'AppearanceScreen',
        icon: <Cloud />,
      },
      {
        title: t('settings.settingScreen.language.title'),
        description: t('settings.settingScreen.language.description'),
        route: 'LanguageScreen',
        icon: <Sun />,
      },
    ],
  },
  {
    headerTitle: t('settings.settingScreen.sectionHeader2'),
    data: [
      {
        title: t('settings.settingScreen.connectedServices.title'),
        description: t('settings.settingScreen.connectedServices.description'),
        route: 'ConnectedServicesScreen',
        icon: <Moon />,
      },
    ],
  },
  {
    headerTitle: t('settings.settingScreen.sectionHeader3'),
    data: [
      {
        title: t('settings.settingScreen.help.title'),
        description: t('settings.settingScreen.help.description'),
        route: 'HelpScreen',
        icon: <Moon />,
      },
    ],
  },
];

const SettingsScreen = ({ navigation }: SettingsScreenProps) => {
  const { t } = useTranslation();
  const data = settingsData(t);

  const handlePress = (item: DataItem) => {
    console.log(item);
    navigation.navigate(item.route);
  };

  return (
    <SafeAreaView style={styles.container}>
      <XStack justifyContent="flex-start" alignItems="center" space={32} marginLeft={12}>
        <Avatar circular size="$9">
          <Avatar.Image
            accessibilityLabel="Cam"
            src="https://images.unsplash.com/photo-1548142813-c348350df52b?&w=150&h=150&dpr=2&q=80"
          />
          <Avatar.Fallback backgroundColor="$blue10" />
        </Avatar>
        <YStack justifyContent="center" alignItems="flex-start" space={8}>
          <Text>John Doe</Text>
          <Text>johndow@gmail.com</Text>
        </YStack>
      </XStack>
      <SectionList
        sections={data}
        style={{ marginTop: 24 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onEndReachedThreshold={0.5}
        SectionSeparatorComponent={() => <View style={{ height: 10 }} />}
        keyExtractor={(item, index) => item.title + index}
        renderItem={({ item }) => TabItem({ item, handlePress })}
        renderSectionHeader={({ section: { headerTitle } }) => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
            <Text style={styles.listTabsTitle}>{headerTitle}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  surface: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  HeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  nameTitle: {
    width: 103,
    height: 27,
    fontSize: 20,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'left',
    color: 'blue',
  },
  emailTile: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'justify',
    color: 'red',
  },
  listTabsTitle: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'justify',
    color: 'blue',
  },
});
