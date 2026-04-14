import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Typography } from "../typography/Typography";
import { ProgressBar } from "../progress-bar/ProgressBar";
import { styles } from "./styles";

export function WordListCard(title,count,progress, color, onPress){
  return(
    <TouchableOpacity
      style={[styles.card, {backgroundColor: color}]}
      onPress={onPress}
      activeOpacity={0.8}
      >
    <Typography variant="body" style={styles.title}>{title}</Typography>
    <Typography variant="caption" style={styles.count}>{count} слов</Typography>
    <View>
      <ProgressBar progress={progress}/>
    </View>
    </TouchableOpacity>
  )
}