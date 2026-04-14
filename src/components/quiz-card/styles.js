
export const styles = ({
  container: {
    alignItems: 'center',
    width: '100%', // Занимаем всю ширину родителя
    paddingHorizontal: '5%', // Вместо жестких чисел используем %
  },
  questionText: {
    fontSize: 32,
    color: '#FFF',
    marginVertical: 40,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  buttonWrapper: {
    width: '48%', // Две колонки с небольшим зазором посередине
    marginBottom: 15,
  }
});