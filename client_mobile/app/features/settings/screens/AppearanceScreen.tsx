import { CheckIcon, Checkbox, CheckboxIcon, CheckboxIndicator, HStack, Image } from '@gluestack-ui/themed';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';

const appearanceData = [
  {
    img: require('../../../core/assets/dark_mode.png'),
  },
  {
    img: require('../../../core/assets/light_mode.png'),
  },
  {
    img: require('../../../core/assets/system_mode.png'),
  },
];

const AppearanceScreen = () => {
  const [setChecked] = useState('colorScheme');

  const handleCheckboxPress = (newTheme: string) => {
    setChecked(newTheme);
    // setTheme(newTheme);
  };

  return (
    <HStack justifyContent="center" flex={1} backgroundColor="background" gap={16} marginTop={24}>
      {appearanceData.map((item, index) => {
        return (
          <View style={styles.imageContainer} key={index}>
            <Image size="lg" source={item.img} style={styles.image} alt="mode" />

            <Checkbox
              marginLeft={8}
              size="md"
              isInvalid={false}
              isDisabled={false}
              value="off"
              aria-label="Checkbox"
              onPress={() => handleCheckboxPress('dark')}>
              <CheckboxIndicator mr="$2">
                <CheckboxIcon as={CheckIcon} />
              </CheckboxIndicator>
            </Checkbox>
          </View>
        );
      })}
    </HStack>
  );
};

export default AppearanceScreen;

const styles = StyleSheet.create({
  imageContainer: {
    gap: 12,
    alignItems: 'center',
  },
  image: {
    borderRadius: 8,
    width: 100,
    height: 200,
  },
});
