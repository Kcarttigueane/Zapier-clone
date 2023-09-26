import { ChevronRightIcon, Icon, VStack } from '@gluestack-ui/themed';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TabItem = ({ item, handlePress }: any) => {
  return (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.listItem}>
        <VStack alignItems="flex-start" justifyContent="center" width="90%" gap={2}>
          <Text style={styles.listTitle}>{item.title}</Text>
          <Text style={styles.listItemDescription}>{item.description}</Text>
        </VStack>
        <Icon as={ChevronRightIcon} size="lg" />
      </View>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 12,
    margin: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 72,
    padding: 10,
    elevation: 4,
  },
  listTitle: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'normal',
    textAlign: 'left',
    color: '#242424',
  },
  listItemDescription: {
    marginLeft: 10,
    height: 15,
    fontSize: 12,
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'justify',
    color: '#808080',
  },
  icon: {
    paddingLeft: 5,
  },
});
