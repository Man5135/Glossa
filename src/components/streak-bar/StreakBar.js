import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Typography } from "../typography/Typography";
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";

export default function StreakBar({ streak = 0, lastActivityDate }) { 
  const [isActiveToday, setIsActiveToday] = useState(false);

  useEffect(() => {
    if (!lastActivityDate) {
      setIsActiveToday(false);
      return;
    }

    // Переводим дату из Firebase в дни
    const ms = lastActivityDate.seconds * 1000;
    const lastDays = Math.floor(ms / (1000 * 60 * 60 * 24));
    
    // Берем текущий день устройства исключительно для визуального горения огонька
    const todayDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));

    // Огонек горит, если день совпадает
    setIsActiveToday(lastDays === todayDays);
  }, [lastActivityDate]);

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