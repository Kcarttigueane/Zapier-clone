import React, { useCallback, useRef, useState } from 'react';
import { Animated, FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import Slides from '../../data/demo';
import NextButton from './NextButton';
import Pagination from './Pagination';
import SlideItem from './SlideItem';

const Slider = () => {
  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const slideRef = useRef<any>(null);

  const animatedEvent = Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
    useNativeDriver: false,
  });

  const handleOnScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => animatedEvent(event), []);

  const handleOnViewableItemsChangedRef = useRef(({ viewableItems }: { viewableItems: any[] }) => {
    if (viewableItems.length > 0) {
      setIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const percentage = ((index + 1) / Slides.length) * 100;

  const scrollTo = () => {
    if (index < Slides.length - 1) {
      slideRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      console.log('End of the slides');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.flatListContainer}>
        <FlatList
          data={Slides}
          renderItem={({ item }) => <SlideItem item={item} />}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          bounces={false}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          onScroll={handleOnScroll}
          onViewableItemsChanged={handleOnViewableItemsChangedRef}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={32}
          ref={slideRef}
        />
      </View>
      <Pagination data={Slides} scrollX={scrollX} index={index} />
      <NextButton percentage={percentage} scrollTo={scrollTo} />
    </View>
  );
};

export default Slider;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    flex: 3,
  },
  button: {},
});
