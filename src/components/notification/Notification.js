import React, { useEffect } from 'react';
import { Animated } from 'react-native';
import { Typography } from '../typography/Typography';
import { styles } from './styles';

export function Notification({ message, type, visible, onHide }) {
  const translateY = new Animated.Value(-100);

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 50,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[
      styles.container, 
      { transform: [{ translateY }], backgroundColor: type === 'error' ? '#FF4444' : '#44FF44' }
    ]}>
      <Typography style={styles.text}>{message}</Typography>
    </Animated.View>
  );
}