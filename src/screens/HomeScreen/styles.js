export const styles = ({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
    paddingHorizontal: 20,
    
  },

  headerTitle: {
    fontSize: 22,
  },

  subtitle: {
    color: '#888',
    marginTop: 5,
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  lessonStepContainer: {
    width: '100%',
    alignItems: 'center',
  },

  // Прямая вертикальная линия
  verticalLine: {
    width: 6,             // Толщина линии
    height: 40,           // Высота линии между кнопками
    backgroundColor: '#333', 
    borderRadius: 3,
  },

  // Цвет линии, если путь пройден
  lineActive: {
    backgroundColor: '#00F0FF',
    borderWidth: 1,
  }
});