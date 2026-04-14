import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";

export function HeaderButton({type= 'close',onPress}){

  const iconName = type === 'close' ? 'close-circle-outline' : 'arrow-back';
  return(
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={iconName} size={32} color="#2196F3"/>
    </TouchableOpacity>
  )

}