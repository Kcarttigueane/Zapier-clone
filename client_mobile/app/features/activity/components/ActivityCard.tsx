import { Divider, HStack, VStack } from '@gluestack-ui/themed';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ActivityCard = ({
  icon,
  message,
  title,
  date,
}: {
  icon: React.ReactNode;
  message: string;
  title: string;
  date: string;
}) => {
  return (
    <VStack space="sm" justifyContent="center" alignItems="center" marginBottom={30}>
      <HStack space="md" alignSelf="flex-start" alignItems="center">
        <View
          style={{
            borderWidth: 1,
            borderRadius: 50,
            height: 35,
            padding: 6,
            width: 35,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {icon}
        </View>
        <Text style={styles.title}>{title}</Text>
        <Divider orientation="vertical" />
        <Text style={{ fontSize: 14 }}>{date}</Text>
      </HStack>

      <View style={styles.card}>
        <Text style={{ fontSize: 16, fontWeight: '700', color: 'black' }}>{message}</Text>
      </View>
    </VStack>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#9C9C9C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 30,
    marginTop: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: 'black',
  },
});

export default ActivityCard;
