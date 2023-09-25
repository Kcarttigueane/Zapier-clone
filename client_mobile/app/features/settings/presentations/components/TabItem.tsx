import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { YStack } from 'tamagui';

const TabItem = ({ item, handlePress }: any) => {
  return (
    <TouchableOpacity onPress={() => handlePress(item)}>
      <View style={styles.listItem}>
        <YStack alignItems="flex-start" justifyContent="center" width="90%">
          <Text style={styles.listItemText}>{item.title}</Text>
          <Text style={styles.listItemDescription}>{item.description}</Text>
        </YStack>
        <MaterialIcons name="keyboard-arrow-right" size={24} style={styles.icon} color="#242424" />
      </View>
    </TouchableOpacity>
  );
};

export default TabItem;

const styles = StyleSheet.create({
  listItem: {
    borderRadius: 10,
    marginHorizontal: 8,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 66,
    padding: 10,
    elevation: 4,
  },
  listItemText: {
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
