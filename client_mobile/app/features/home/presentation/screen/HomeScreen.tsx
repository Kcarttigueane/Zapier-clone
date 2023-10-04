import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Touchable, TouchableOpacity } from 'react-native';
import { Box, VStack, Text, ScrollView } from '@gluestack-ui/themed';
import { Tabs, TabsTabList, TabsTab, TabsTabTitle, TabsTabPanels, TabsTabPanel } from '@gluestack-ui/themed';
import { MailIcon, ClockIcon } from '@gluestack-ui/themed';

const Card = ({ message }: { message: string }) => {
  const handleCardClick = (message: string) => {
    console.log('click with message ' + message);
  };

  return (
    <TouchableOpacity onPress={() => handleCardClick(message)}>
      <Box style={styles.card}>
        <VStack px={6} pt={4} pb={6}>
          <Box style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <MailIcon w="$8" h="$8" style={{ color: 'black' }} />
            <ClockIcon w="$8" h="$8" style={{ color: 'black', marginLeft: 10 }} />
          </Box>
          <Text fontSize="$xl" fontWeight="bold" color="black" fontFamily="Inter">
            {message}
          </Text>
        </VStack>
      </Box>
    </TouchableOpacity>
  );
};

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  return (
    <Tabs value="tab1">
      <TabsTabList style={{ paddingLeft: 30, marginBottom: 20, flexDirection: 'row' }}>
        <TabsTab value="tab1" onPress={() => handleTabClick('tab1')} style={{ borderRadius: 0, marginRight: -10 }}>
          <TabsTabTitle style={[styles.titleTabs, { borderBottomWidth: activeTab === 'tab1' ? 3 : 0 }]}>
            All (0)
          </TabsTabTitle>
        </TabsTab>
        <TabsTab value="tab2" onPress={() => handleTabClick('tab2')} style={{ borderRadius: 0 }}>
          <TabsTabTitle style={[styles.titleTabs, { borderBottomWidth: activeTab === 'tab2' ? 3 : 0 }]}>
            Archived (0)
          </TabsTabTitle>
        </TabsTab>
      </TabsTabList>
      <TabsTabPanels>
        <TabsTabPanel value="tab1">
          <View style={{ alignItems: 'center' }}>
            <ScrollView>
              <Card message="If Every day at 10:15 PM, then Send me an email at JohnDoe@gmail.com" />
              <Card message="This is a test at example@gmail.com" />
              <Card message="This is a test at example@gmail.com" />
              <Card message="This is a test at example@gmail.com" />
              <Card message="This is a test at example@gmail.com" />
              <View style={{ height: 120 }}></View>
            </ScrollView>
          </View>
        </TabsTabPanel>
        <TabsTabPanel value="tab2">
          <Text>Archived</Text>
        </TabsTabPanel>
      </TabsTabPanels>
    </Tabs>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 30,
    width: '92%',
    elevation: 5,
    backgroundColor: 'white',
    height: 160,
    borderRadius: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    marginHorizontal: 12,
  },
  titleTabs: {
    fontSize: 18,
    fontFamily: 'Inter',
    fontWeight: 'bold',
    color: 'black',
  },
});

export default HomeScreen;
