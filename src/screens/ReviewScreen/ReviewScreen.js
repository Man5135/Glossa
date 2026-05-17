import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { Typography } from '../../components/typography/Typography';
import { Button } from '../../components/button/Button';
import { HeaderButton } from '../../components/header-button/HeaderButton';
import { styles } from './styles';
import { updateStreak } from '../../utils/streakLogic';
import { auth } from '../../firebase/config';
import { Audio } from 'expo-av';

export default function ReviewScreen({ route, navigation }) {
  // 1. Получаем данные. В HomeScreen должно быть learnedWords (это массив строк-ID)
  const { lessons = [], learnedWordsIds = [] } = route.params || {};

  const [quizSteps, setQuizSteps] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);


  const playFeedbackSound = async(isCorrect) => {
    const soundPath = isCorrect
    ? require('../../../assets/sounds/correct.mp3')
    : require('../../../assets/sounds/wrong.mp3');
  
    const { sound } = await Audio.Sound.createAsync(soundPath);
    await sound.playAsync();
  
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
  };

  useEffect(() => {
    if (lessons.length > 0 && learnedWordsIds.length > 0) {
      prepareQuiz();
    } else {
      setLoading(false);
      Alert.alert("Ошибка", "Нет слов для повторения. Пройдите уроки.");
      navigation.goBack();
    }
  }, []);

  const prepareQuiz = () => {
    try {
      // Приводим все ID к строкам для надежности
      const cleanLearnedIds = learnedWordsIds.map(id => id.toString());

      // Собираем все айтемы типа 'word' из всех доступных уроков
      let allWordsInDb = [];
      lessons.forEach(lesson => {
        if (lesson.content) {
          const words = lesson.content.filter(item => item.type === 'word');
          allWordsInDb.push(...words);
        }
      });

      // Фильтруем только те слова, ID которых есть в списке выученных
      const myWords = allWordsInDb.filter(item => 
        item.id !== undefined && cleanLearnedIds.includes(item.id.toString())
      );

      // Убираем дубликаты по ID
      const uniqueWords = Array.from(new Map(myWords.map(w => [w.id, w])).values());

      if (uniqueWords.length < 4) {
        Alert.alert("Мало слов", `Нужно минимум 4 слова. Найдено: ${uniqueWords.length}`);
        navigation.goBack();
        return;
      }

      // Формируем квиз
      const quiz = uniqueWords.map(wordObj => {
        // ВАЖНО: берем original (греческий) и translation (русский)
        const greek = wordObj.original || "???"; 
        const rus = wordObj.translation || "---";

        // Генерируем 3 случайных неправильных ответа
        const otherTranslations = uniqueWords
          .filter(w => w.id !== wordObj.id)
          .map(w => w.translation)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);

        const options = [rus, ...otherTranslations].sort(() => 0.5 - Math.random());

        return {
          greekText: greek, // Будем выводить это в карточке
          correctAnswer: rus,
          allOptions: options
        };
      }).sort(() => 0.5 - Math.random())
      .slice(0, 10);

      setQuizSteps(quiz);
    } catch (e) {
      console.error(e);
      Alert.alert("Ошибка", "Не удалось подготовить тест");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (selectedOption) => {
  const currentStep = quizSteps[currentIndex];
  const isCorrect = selectedOption === currentStep.correctAnswer;

  // Воспроизводим звук
  await playFeedbackSound(isCorrect);

  if (isCorrect) {
    if (currentIndex < quizSteps.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const uid = auth.currentUser?.uid;
      if (uid) await updateStreak(uid);
      
      Alert.alert("Успех!", "Все слова повторены!");
      navigation.goBack();
    }
  } else {
    Alert.alert("Неверно", "Попробуйте еще раз");
  }
};

  if (loading || quizSteps.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#00F0FF" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <HeaderButton type="close" onPress={() => navigation.goBack()} />
        <Typography variant="header" style={styles.title}>Повторение</Typography>
        <View style={{width: 40}} />
      </View>

      <View style={styles.container}>
        <Typography style={styles.progressText}>
          Слово {currentIndex + 1} из {quizSteps.length}
        </Typography>

        <View style={styles.card}>
          {/* ОБРАТИ ВНИМАНИЕ: здесь greekText */}
          <Typography style={styles.wordText}>
            {quizSteps[currentIndex]?.greekText}
          </Typography>
        </View>

        <View style={styles.optionsContainer}>
          {quizSteps[currentIndex]?.allOptions.map((opt, index) => (
            <Button 
              key={`${currentIndex}-${index}`}
              title={opt}
              onPress={() => handleAnswer(opt)}
              style={styles.optionButton}
            />
          ))}
        </View>
      </View>
    </ScreenWrapper>
  );
}