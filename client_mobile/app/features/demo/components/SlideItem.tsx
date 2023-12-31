import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, ImageSourcePropType, StyleSheet, Text, View, useWindowDimensions } from 'react-native';

export interface SlideItemProps {
  item: {
    img: ImageSourcePropType;
    title: string;
    description: string;
  };
}

const SlideItem: FC<SlideItemProps> = ({ item }) => {
  const { width } = useWindowDimensions();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { width }]}>
      <Animated.Image source={item.img} resizeMode="contain" style={[styles.image, { width: width * 0.9 }]} />
      <View style={styles.content}>
        <Text style={styles.title}>{t(item.title)}</Text>
        <Text style={styles.description}>{t(item.description)}</Text>
      </View>
    </View>
  );
};

export default SlideItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 0.7,
    justifyContent: 'center',
  },
  content: {
    flex: 0.3,
    justifyContent: 'center',
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '800',
    color: '#333',
  },
  description: {
    textAlign: 'center',
    fontWeight: '600',
    paddingHorizontal: 32,
    color: '#333',
  },
});
