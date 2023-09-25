import { Check } from '@tamagui/lucide-icons';
import React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Checkbox, XStack } from 'tamagui';

const appearanceData = [
  {
    img: require('../../../../core/assets/dark_mode.png'),
  },
  {
    img: require('../../../../core/assets/light_mode.png'),
  },
  {
    img: require('../../../../core/assets/system_mode.png'),
  },
];

const AppearanceScreen = () => {
  const onCheckedChange = () => {
    console.log('Checked');
  };

  return (
    <XStack justifyContent="center" flex={1} backgroundColor="background" gap={16} marginTop={24}>
      {appearanceData.map((item, index) => {
        return (
          <View style={styles.imageContainer} key={index}>
            <Animated.Image source={item.img} resizeMode="contain" style={styles.image} />
            <Checkbox size="$4" onCheckedChange={onCheckedChange}>
              <Checkbox.Indicator>
                <Check />
              </Checkbox.Indicator>
            </Checkbox>
          </View>
        );
      })}
    </XStack>
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
