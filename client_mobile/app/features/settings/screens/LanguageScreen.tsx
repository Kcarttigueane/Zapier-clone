import { HStack } from '@gluestack-ui/themed';
import i18next from 'i18next';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const LanguageScreen = () => {
  const data = [
    {
      title: 'French',
      imageUrl: require('../../../core/assets/fr_flag.png'),
      language: 'fr',
    },
    {
      title: 'English',
      imageUrl: require('../../../core/assets/en_flag.png'),
      language: 'en',
    },
  ];

  const [selectedLanguage, setSelectedLanguage] = useState(
    i18next.language === data[0].language ? data[0].title : data[1].title,
  );

  const changeLanguage = (language: string) => {
    i18next.changeLanguage(language);
    setSelectedLanguage(language === data[0].language ? data[0].title : data[1].title);
  };

  return (
    <FlatList
      style={{ margin: 12 }}
      data={data}
      keyExtractor={item => item.title}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => changeLanguage(item.language)}>
          <HStack
            justifyContent="space-between"
            alignItems="center"
            height={60}
            flexDirection="row"
            marginVertical={8}
            borderRadius={12}
            backgroundColor="#FFF"
            borderColor="#ccc"
            borderWidth={1}
            elevation={3}
            padding={16}
            marginHorizontal={12}>
            <HStack alignItems="center" justifyContent="flex-start" flexDirection="row">
              <Image source={item.imageUrl} resizeMode="contain" style={{ height: 20, width: 30 }} />

              <Text style={styles.title}>{item.title}</Text>
            </HStack>
            <View>{selectedLanguage === item.title && <AntDesign name="checkcircle" size={20} color="#000000" />}</View>
          </HStack>
        </TouchableOpacity>
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

export default LanguageScreen;
