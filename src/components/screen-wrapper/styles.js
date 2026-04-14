import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1, // Занимает всё доступное пространство
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    // backgroundColor: '#1B3139', // Убираем сплошной цвет фона, он теперь прозрачный
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1, // Важно для центровки контента по вертикали
    justifyContent: 'center', // Центрирует всё содержимое ScrollView
  },
  innerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 400, // Ограничиваем ширину формы входа для больших экранов
    alignSelf: 'center', // Центрирует сам контейнер по горизонтали
    paddingHorizontal: 25, // Отступы по бокам
    paddingTop: 40,     // Отступ сверху (под Лого)
    paddingBottom: 40,  // Отступ снизу (над кнопкой)
    alignItems: 'center', // Центрирует Лого, Инпуты и Кнопку по горизонтали внутри себя
  },
});