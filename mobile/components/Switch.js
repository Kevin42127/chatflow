import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated, Platform } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const Switch = ({ value, onValueChange, disabled = false }) => {
  const { colors } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value]);

  // Android和iOS都使用相同的標準顏色
  const thumbStyle = {
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [2, 22],
        }),
      },
    ],
    backgroundColor: '#FFFFFF',
  };

  // 根據平台使用標準顏色
  const trackStyle = {
    backgroundColor: Platform.OS === 'ios' 
      ? (value ? '#34C759' : '#E5E5E7')  // iOS綠色和灰色
      : (value ? '#4CAF50' : '#9E9E9E')  // Android Material Design綠色和灰色
  };

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <View style={[styles.track, trackStyle]}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    position: 'absolute',
    top: 2,
    left: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default Switch;
