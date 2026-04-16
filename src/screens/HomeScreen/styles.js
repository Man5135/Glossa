import { StyleSheet } from "react-native";

export const styles = ({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  subtitle: {
    color: '#888',
    marginTop: 5,
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  // Добавим вспомогательный стиль для центрирования, если уроков нет
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  }
});