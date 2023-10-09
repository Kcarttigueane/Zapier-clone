import { Icon, SearchIcon } from '@gluestack-ui/themed';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

const ServiceSearchBar = ({ onChangeText, value }: { onChangeText: Function; value: string }) => {
  return (
    <View style={styles.search}>
      <TextInput
        placeholder="Rechercher..."
        onChangeText={query => {
          onChangeText(query);
        }}
        value={value}
      />
      <TouchableOpacity onPress={() => onChangeText(value)}>
        <View style={{ backgroundColor: '#613EEA', borderRadius: 50, padding: 6, marginRight: 10 }}>
          <Icon as={SearchIcon} size="lg" color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderColor: '#E5E7EB',
    borderWidth: 2,
    borderRadius: 30,
    fontSize: 16,
    fontFamily: 'Inter',
    paddingLeft: 30,
    marginTop: 10,
    color: 'black',
  },
});

export default ServiceSearchBar;
