import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { colors } from '../../styles/colors';
import { borderRadius } from '../../styles/spacing';

/**
 * Audio level indicator (visualizer placeholder)
 * Displays animated bars to represent audio levels
 * @param {Object} props
 * @param {number} [props.level] - Audio level (0-1)
 * @param {boolean} [props.isActive] - Whether audio is being captured
 * @param {number} [props.barCount] - Number of bars to display
 * @param {number} [props.width] - Component width
 * @param {number} [props.height] - Component height
 * @param {string} [props.color] - Bar color
 * @param {Object} [props.style] - Additional styles
 */
const AudioLevelIndicator = ({
  level = 0,
  isActive = false,
  barCount = 5,
  width = 100,
  height = 40,
  color = colors.primary,
  style,
  ...props
}) => {
  const animatedValues = useRef(
    Array(barCount)
      .fill(0)
      .map(() => new Animated.Value(0.2))
  ).current;

  useEffect(() => {
    if (isActive) {
      // Animate bars based on audio level with some randomization
      const animations = animatedValues.map((anim, index) => {
        const baseHeight = Math.min(1, level + Math.random() * 0.3);
        const delay = index * 50;

        return Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: baseHeight,
            duration: 100,
            useNativeDriver: false,
          }),
        ]);
      });

      Animated.parallel(animations).start();
    } else {
      // Reset to idle state
      const animations = animatedValues.map((anim) =>
        Animated.timing(anim, {
          toValue: 0.2,
          duration: 200,
          useNativeDriver: false,
        })
      );

      Animated.parallel(animations).start();
    }
  }, [level, isActive, animatedValues]);

  const barWidth = (width - (barCount - 1) * 4) / barCount;

  return (
    <View style={[styles.container, { width, height }, style]} {...props}>
      {animatedValues.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              width: barWidth,
              backgroundColor: isActive ? color : colors.gray300,
              height: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['20%', '100%'],
              }),
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: {
    borderRadius: borderRadius.sm,
  },
});

export default AudioLevelIndicator;
