
export const styles = {
  container: {
    paddingBottom: 40,
  },
  headerTitle: {
    marginBottom: 20,
  },
  sectionLabel: {
    marginTop: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  // Стиль карточки блока (слово, правило или квиз)
  blockContainer: {
    backgroundColor: '#1A1A1A', // Чуть темнее основного фона для контраста
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 8,
  },
  blockTypeText: {
    color: '#00F0FF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  deleteButtonText: {
    color: '#FF4444',
    fontSize: 14,
    fontWeight: '500',
  },
  // Панель кнопок добавления
  addButtonsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 30,
    marginTop: 10,
  },
  addBlockButton: {
    flex: 1,
    minWidth: '30%', // Чтобы кнопки красиво вставали в ряд
  },
  // Поля ввода внутри блоков
  inputSpacing: {
    marginBottom: 10,
  },
  quizOptionsInfo: {
    fontSize: 10,
    color: '#888',
    marginBottom: 5,
    marginTop: -5,
  }
}