import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // Общие контейнеры
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  prog: {
    flex: 1,
    marginLeft: 10,
  },
  main: {
    flex: 1,
    width: '100%',
    padding: 20,
  },
  footer: {
    padding: 20,
    backgroundColor: 'transparent',
  },

  // Карточки (Слова, Грамматика)
  cardContainer: {
    flex: 1,
    width: '100%',
  },
  innerCard: {
    backgroundColor: '#121212',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    shadowColor: '#00F0FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },

  // ИЗОБРАЖЕНИЕ (ОБЯЗАТЕЛЬНО С ВЫСОТОЙ)
  wordImage: {
    width: '100%',
    height: 250, // Фиксированная высота, чтобы картинка была видна
    borderRadius: 24,
    marginBottom: 20,
    backgroundColor: '#1A1A1A', // Фон на время загрузки
  },

  // Грамматика и правила
  ruleBadge: {
    backgroundColor: 'rgba(0, 240, 255, 0.1)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#00F0FF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  exampleBox: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    borderLeftWidth: 2,
    borderLeftColor: '#444',
  },

  // ТАБЛИЦЫ
  tableContainer: {
    marginTop: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  tableRowEven: {
    backgroundColor: '#161616',
  },
  tableCellLeft: {
    flex: 1,
    color: '#00F0FF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableCellRight: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: 16,
  },

  // КВИЗЫ
  optionButton: {
    backgroundColor: '#1A1A1A',
    padding: 20,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  correctOption: {
    backgroundColor: 'rgba(0, 240, 255, 0.2)',
    borderColor: '#00F0FF',
  },
  wrongOption: {
    backgroundColor: 'rgba(255, 68, 68, 0.2)',
    borderColor: '#FF4444',
  },
});