import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 5,
    borderBottomWidth: 5,           // Толщина кнопки
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
  },
  primary: {
    backgroundColor: '#0A54C3',
  },
  danger: {
    backgroundColor: '#A70204',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  disabled:{
    opacity: 0.6,
  }
});