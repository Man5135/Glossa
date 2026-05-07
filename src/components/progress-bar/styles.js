import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({ // Убрали лишнее "="
  container: {
    width: '100%',     // Растягиваем на всю ширину отведенного места
    height: 12,        // Исправили height
    backgroundColor: '#333', // Добавь фоновый цвет, чтобы видеть пустую полоску
    borderRadius: 10,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',    // Исправили height
    backgroundColor: '#00E5FF',
    borderRadius: 10
  }
});