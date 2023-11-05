/* eslint-disable react-hooks/exhaustive-deps */
import {
  ScrollView,
  Spinner,
  Tabs,
  TabsTab,
  TabsTabList,
  TabsTabPanel,
  TabsTabPanels,
  TabsTabTitle,
  Toast,
  ToastTitle,
  VStack,
  useToast,
} from '@gluestack-ui/themed';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import useAutomationStore from '../../../core/zustand/useAutomation';
import ArchivedCard from '../components/ArchivedCard';
import AutomationCard from '../components/AutomationCard';

const HomeScreen = () => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('All');
  const { automationWithDetails, fetchDetailedAutomations, isAutomationsLoading } = useAutomationStore(state => state);

  const handleTabClick = (tabName: string) => setActiveTab(tabName);

  useEffect(() => {
    try {
      fetchDetailedAutomations();
    } catch (error: any) {
      console.error('Error fetching automations', error);
      toast.show({
        placement: 'top',
        render: ({ id }) => {
          return (
            <Toast nativeID={'toast-' + id} action="error" variant="accent">
              <VStack space="sm">
                <ToastTitle>{error.response.data.detail}</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
    }
  }, []);

  if (isAutomationsLoading) {
    return (
      <VStack flex={1} justifyContent="center" alignItems="center">
        <Spinner accessibilityLabel="Loading..." size="large" />
      </VStack>
    );
  }

  return (
    <Tabs value="All" style={styles.screenContainer}>
      <TabsTabList style={styles.tabsContainer}>
        <TabsTab value="All" onPress={() => handleTabClick('All')}>
          <TabsTabTitle style={[styles.titleTabs, { borderBottomWidth: activeTab === 'All' ? 3 : 0 }]}>
            All {`(${automationWithDetails.length})`}
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
          {automationWithDetails.length === 0 ? (
            <VStack flex={1} justifyContent="center" alignItems="center">
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  fontFamily: 'Inter',
                  textAlign: 'center',
                }}>
                No automations yet. Create one by clicking on the + button below.
              </Text>
            </VStack>
          ) : (
            <View style={{ paddingBottom: 60 }}>
              <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12, marginBottom: 12 }}>
                {automationWithDetails.map((item, index) => (
                  <AutomationCard item={item} key={index} />
                ))}
              </ScrollView>
            </View>
          )}
        </TabsTabPanel>
        <TabsTabPanel value="Archived">
          <View style={{ paddingBottom: 60 }}>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12, marginBottom: 12 }}>
              {automationWithDetails.map((item, index) => (
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
