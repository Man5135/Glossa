import React, { useState } from "react";
import { View } from "react-native";
import { Typography } from "../../components/typography/Typography";
import { HeaderButton } from "../../components/header-button/HeaderButton";
import { ProgressBar } from "../../components/progress-bar/ProgressBar";
import { QuizCard } from "../../components/quiz-card/QuizCard";
import { styles } from "./styles";

const MOCK_WORDS = [
  { id: '1', greek: 'Γεια', translation: 'Привет' },
  { id: '2', greek: 'Ευχαριστώ', translation: 'Спасибо' },
  { id: '3', greek: 'Παρακαλώ', translation: 'Пожалуйста' },
];

export function TrainingScreen({ navigation, route }) {
  // 1. Используем MOCK_WORDS, если route.params.words пуст
  const { words = MOCK_WORDS } = route.params || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);

  // 2. Проверка на наличие слов перенесена в начало
  if (!words || words.length === 0) {
    return (
      <View style={styles.container}>
        <Typography variant="body">Нет слов для тренировки</Typography>
      </View>
    );
  }

  const progress = (currentIndex / words.length);

  const handleAnswer = (selectedOption) => {
    const isCorrect = selectedOption === words[currentIndex].translation;
    const newScore = isCorrect ? score + 1 : score;

    if (isCorrect) setScore(newScore);

    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      navigation.navigate('ResultScreen', { score: newScore, total: words.length });
    }
  };

  // 3. Рендер должен быть ТУТ, а не внутри handleAnswer
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}> 
      <View style={styles.header}>
        <HeaderButton type="close" onPress={() => navigation.goBack()} />
        <ProgressBar progress={progress} />
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>
        <QuizCard
          question={words[currentIndex].greek}
          options={words[currentIndex].options}
          onAnswer={handleAnswer}
        />
      </View>
    </View>
  );
}