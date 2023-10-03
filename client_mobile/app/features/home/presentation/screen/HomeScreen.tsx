import React from 'react';
import { View, StyleSheet} from 'react-native';
import { Box, Image, VStack, Text, ScrollView} from '@gluestack-ui/themed';
import { MailIcon, ClockIcon } from '@gluestack-ui/themed';

const Card = ({ message }: { message: string }) => {
  return (
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
  );
};

const HomeScreen = () => {

  return (
    <View style={{ alignItems: 'center' }}>
      <ScrollView>
        <Card message="If Every day at 10:15 PM, then Send me an email at JohnDoe@gmail.com"/>
        <Card message="This is a test at example@gmail.com"/>
        <Card message="This is a test at example@gmail.com"/>
        <Card message="This is a test at example@gmail.com"/>
        <Card message="This is a test at example@gmail.com"/>
        <View style={{height: 20}}></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 30,
    width: '90%',
    elevation: 5,
    backgroundColor: "white",
    height: 160,
    borderRadius: 20,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
});

export default HomeScreen;
