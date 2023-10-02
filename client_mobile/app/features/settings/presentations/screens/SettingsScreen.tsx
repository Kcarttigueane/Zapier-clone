import { Avatar, AvatarFallbackText, AvatarImage, Text, VStack } from '@gluestack-ui/themed';
import { RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TFunction } from 'i18next';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SafeAreaView, SectionList, StyleSheet, View } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
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
        icon: <Feather name="user" />,
      },
      {
        title: t('settings.settingScreen.appearance.title'),
        description: t('settings.settingScreen.appearance.description'),
        route: 'AppearanceScreen',
        icon: <Feather name="user" />,
      },
      {
        title: t('settings.settingScreen.language.title'),
        description: t('settings.settingScreen.language.description'),
        route: 'LanguageScreen',
        icon: <Feather name="user" />,
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
        icon: <Feather name="user" />,
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
        icon: <Feather name="user" />,
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
      <View style={styles.HeaderContainer}>
        <Avatar size="xl">
          <AvatarFallbackText>SS</AvatarFallbackText>
          <AvatarImage
            source={{
              uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=800&q=60',
            }}
          />
        </Avatar>
        <VStack justifyContent="center" alignItems="flex-start" space="md">
          <Text style={styles.nameTitle}>John Doe</Text>
          <Text style={styles.emailTitle}>johndow@gmail.com</Text>
        </VStack>
      </View>
      <SectionList
        sections={data}
        style={{ marginTop: 12 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
        onEndReachedThreshold={0.5}
        contentContainerStyle={{ paddingBottom: 120 }}
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
    gap: 48,
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  nameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'left',
    color: 'black',
  },
  emailTitle: {
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'justify',
    color: '#808080',
  },
  listTabsTitle: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'justify',
    color: '#808080',
  },
});
