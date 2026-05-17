import React from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";

export function HeaderButton({type= 'close',onPress}){

  return(
    <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name="arrow-back" size={32} color="#2196F3"/>
    </TouchableOpacity>
  )

}