import React from "react";
import { View } from "react-native";
import { Typography } from "../typography/Typography";
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";

export default function StreakBar({ streak = 0, lastActivityDate }) { 
  const today = new Date().toISOString().split('T')[0];
  const isActiveToday = lastActivityDate === today;

  return (
    <View style={[styles.container, isActiveToday && styles.activeContainer]}>
      <Ionicons 
        name="flame" 
        size={24} 
        color={isActiveToday ? "#FFA000" : "#757575"} 
      />
      <Typography style={[styles.count, isActiveToday && styles.activeText]}>
        {streak}
      </Typography>
    </View>
  );
}
