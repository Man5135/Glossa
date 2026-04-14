import React from "react";
import { View } from "react-native";
import { styles } from "./styles";

export function ProgressBar({progress} ){

  return(
    <View style={styles.container}>
        <View style={[styles.fill, { width: `${progress * 100}%`}]} />
    </View>
  );
}