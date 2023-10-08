import { HStack, Switch } from '@gluestack-ui/themed';
import React from 'react';
import { Animated, FlatList, StyleSheet, Text } from 'react-native';

const ConnectedServices = () => {
  const data = [
    {
      title: 'Gmail',
      imageUrl: require('../../../core/assets/gmail.png'),
    },
    {
      title: 'Google Calendar',
      imageUrl: require('../../../core/assets/google_calendar.png'),
    },
  ];

  return (
    <FlatList
      getItemLayout={(data, index) => ({
        length: 100,
        offset: 100 * index,
        index,
      })}
      style={{ margin: 12 }}
      data={data}
      keyExtractor={item => item.title}
      renderItem={({ item }) => (
        <HStack
          justifyContent="space-between"
          alignItems="center"
          height={60}
          flexDirection="row"
          marginVertical={8}
          borderRadius={12}
          backgroundColor="#F4F5F6"
          borderColor="#D8DADC"
          borderWidth={1}
          elevation={4}
          padding={16}
          marginHorizontal={12}>
          <HStack alignItems="center" justifyContent="flex-start" flexDirection="row">
            <Animated.Image source={item.imageUrl} resizeMode="contain" style={{ height: 20, width: 30 }} />

            <Text style={styles.title}>{item.title}</Text>
          </HStack>
          <Switch size="md" isDisabled={false} />
        </HStack>
      )}
    />
  );
};

const styles = StyleSheet.create({
  title: {
    marginLeft: 20,
    fontSize: 14.5,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'left',
    color: 'rgba(0, 0, 0, 0.7)',
  },
});

export default ConnectedServices;
