import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { styles } from './styles.js';

export function Button({ title, onPress, variant = 'primary' }) {
  const buttonStyle = variant === 'danger' ? styles.danger : styles.primary;

  return (
    <TouchableOpacity 
      style={[styles.button, buttonStyle]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}