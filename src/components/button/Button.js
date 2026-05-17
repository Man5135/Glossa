import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles.js';

export function Button({ title, onPress, variant = 'primary', disabled= false }) {
  const buttonStyle = variant === 'danger' ? styles.danger : styles.primary;

  return (
    <TouchableOpacity 
      style={[styles.button, buttonStyle, disabled && styles.disabled]} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}