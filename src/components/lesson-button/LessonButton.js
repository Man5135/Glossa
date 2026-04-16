import React from "react";
import { TouchableOpacity, View} from "react-native";
import { Typography } from "../typography/Typography";
import { Ionicons } from '@expo/vector-icons';
import { styles } from "./styles";

export function LessonButton({ title, status, onPress }) {
  const getBackgroundColor = () => {
    switch (status) {
      case 'completed': return '#4CAF50'; // Зеленый
      case 'available': return '#2196F3'; // Синий
      case 'test': return '#FFD700';      // Золотой
      case 'locked': return '#757575';    // Серый
      default: return '#2196F3';
    }
  };

  const isLocked = status === 'locked';

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor(), opacity: isLocked ? 0.6 : 1 }
      ]}
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Typography variant="body" style={styles.text}>{title}</Typography>
        
        {isLocked ? (
          <Ionicons name="lock-closed" size={20} color="#FFF" />
        ) : status === 'completed' ? (
          <Ionicons name="checkmark-circle" size={20} color="#FFF" />
        ) : (
          <Ionicons name="play-circle" size={20} color="#FFF" />
        )}
      </View>
    </TouchableOpacity>
  );
}

