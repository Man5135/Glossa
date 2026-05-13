import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  button: {
    padding: 20,
    borderRadius: 15,
    width: '100%',
    borderBottomWidth: 5,           // Толщина кнопки
    borderBottomColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 18,
  },
  completed: {
    elevation: 10,
  }
});