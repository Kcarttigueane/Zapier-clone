import React, { FC, useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Circle, G, Svg } from 'react-native-svg';
import AntDesign from 'react-native-vector-icons/AntDesign';

interface NextButtonProps {
  percentage: number;
  scrollTo: () => void;
}

const NextButton: FC<NextButtonProps> = ({ percentage, scrollTo }) => {
  const size = 128;
  const stokeWidth = 2;
  const center = size / 2;
  const radius = size / 2 - stokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const progressAnimation = useRef(new Animated.Value(percentage)).current;
  const progressRef = useRef<any>(null);

  const animation = useCallback(
    (toValue: number) => {
      return Animated.timing(progressAnimation, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }).start();
    },
    [progressAnimation],
  );

  useEffect(() => {
    if (progressRef?.current) {
      const initialStrokeDashoffset = circumference - (circumference * percentage) / 100;
      progressRef.current.setNativeProps({
        strokeDashoffset: initialStrokeDashoffset,
      });
    }

    animation(percentage);
  }, [circumference, percentage, animation]);

  useEffect(() => {
    animation(percentage);
  }, [percentage, animation]);

  useEffect(() => {
    progressAnimation.addListener((value: any) => {
      const strokeDashoffset = circumference - (circumference * value.value) / 100;

      if (progressRef?.current) {
        progressRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => {
      progressAnimation.removeAllListeners();
    };
  }, [circumference, percentage, progressAnimation]);

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} fill={'none'}>
        <G rotation="-90" origin={center}>
          <Circle stroke="#E6E7E8" cx={center} cy={center} r={radius} strokeWidth={stokeWidth} />
          <Circle
            ref={progressRef}
            stroke="#000000"
            cx={center}
            cy={center}
            r={radius}
            strokeWidth={stokeWidth}
            strokeDasharray={circumference}
          />
        </G>
      </Svg>
      <TouchableOpacity onPress={scrollTo} style={styles.button} activeOpacity={0.6}>
        <AntDesign name="arrowright" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default NextButton;

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: 'absolute',
    backgroundColor: '#000000',
    borderRadius: 100,
    padding: 16,
  },
});
