import {
  ScrollView,
  Tabs,
  TabsTab,
  TabsTabList,
  TabsTabPanel,
  TabsTabPanels,
  TabsTabTitle,
} from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import AutomationCard from '../components/AutomationCard';
import ArchivedCard from '../components/ArchivedCard';

export interface MockupAutomationData {
  id: number;
  title: string;
  serviceLogo1: any;
  serviceLogo2: any;
}

const mockupAutomation: MockupAutomationData[] = [
  {
    id: 1,
    title: 'If Every day at 10:15 PM, then Send me an email at johnDoe@gmail.com',
    serviceLogo1: require('../../../core/assets/facebook.png'),
    serviceLogo2: require('../../../core/assets/discord.png'),
  },
  {
    id: 2,
    title: 'Send a message discord when a new email arrives',
    serviceLogo1: require('../../../core/assets/discord.png'),
    serviceLogo2: require('../../../core/assets/spotify.png'),
  },
  {
    id: 3,
    title: 'Send a message discord when a new email arrives',
    serviceLogo1: require('../../../core/assets/discord.png'),
    serviceLogo2: require('../../../core/assets/gmail.png'),
  },
];

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('All');

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <Tabs value="All" style={styles.screenContainer}>
      <TabsTabList style={styles.tabsContainer}>
        <TabsTab value="All" onPress={() => handleTabClick('All')}>
          <TabsTabTitle style={[styles.titleTabs, { borderBottomWidth: activeTab === 'All' ? 3 : 0 }]}>
            All {`(${mockupAutomation.length})`}
          </TabsTabTitle>
        </TabsTab>
        <TabsTab value="Archived" onPress={() => handleTabClick('Archived')}>
          <TabsTabTitle style={[styles.titleTabs, { borderBottomWidth: activeTab === 'Archived' ? 3 : 0 }]}>
            Archived (0)
          </TabsTabTitle>
        </TabsTab>
      </TabsTabList>
      <TabsTabPanels>
        <TabsTabPanel value="All">
          <View style={{ paddingBottom: 60 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12, marginBottom: 12 }}>
              {mockupAutomation.map((item, index) => (
                <AutomationCard item={item} key={index} />
              ))}
            </ScrollView>
          </View>
        </TabsTabPanel>
        <TabsTabPanel value="Archived">
          <View style={{ paddingBottom: 60 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12, marginBottom: 12 }}>
              {mockupAutomation.map((item, index) => (
                <ArchivedCard item={item} key={index} />
              ))}
            </ScrollView>
          </View>
        </TabsTabPanel>
      </TabsTabPanels>
    </Tabs>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  tabsContainer: {
    alignSelf: 'center',
  },
  titleTabs: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default HomeScreen;
