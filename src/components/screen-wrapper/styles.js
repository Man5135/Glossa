import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
     backgroundColor: '#1B3139',
     
  },
  scrollView: {
    width: '100%'
  },
  contentContainer: {
    flexGrow: 1, 
    justifyContent: 'flex-start',
  },
  innerContainer: {
    width: '100%',
    maxWidth: 400, // Ограничиваем ширину формы входа для больших экранов
    alignSelf: 'center', // Центрирует сам контейнер по горизонтали
    paddingHorizontal: 25, // Отступы по бокам
    paddingTop: 40,     // Отступ сверху (под Лого)
    paddingBottom: 60,  // Отступ снизу (над кнопкой)
  },
});