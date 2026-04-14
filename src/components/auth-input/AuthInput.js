import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { styles } from './styles';

export function AuthInput({ label, value, onChangeText, placeholder, secureTextEntry = false }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#888"
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );
}