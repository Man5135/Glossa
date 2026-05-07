import { StyleSheet } from "react-native";

export const styles = {
  container: {
    paddingBottom: 40,
  },
  header: {
    color: '#00F0FF',
    textAlign: 'center',
    marginTop: 20,
  },
  subHeader: {
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '%50', // Две колонки
    backgroundColor: '#1A2A32',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2A3A42',
    // Тень для мобилок
    elevation: 3,
    // Тень для веба
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  char: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  name: {
    color: '#00F0FF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  soundBadge: {
    backgroundColor: '#2A3A42',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  soundText: {
    color: '#888',
    fontSize: 13,
    fontWeight: 'bold',
  },
};