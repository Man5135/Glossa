import React, { useState, useEffect } from 'react';
import { 
  View, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from '../../firebase/config';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './styles';
import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { HeaderButton } from '../../components/header-button/HeaderButton';
import { ProgressBar } from '../../components/progress-bar/ProgressBar';
import { Button } from '../../components/button/Button';
import { Typography } from '../../components/typography/Typography';

// --- ВНУТРЕННИЕ КОМПОНЕНТЫ КАРТОЧЕК ---
const InternalWordCard = ({ data }) => (
  <View style={styles.cardContainer}>
    {data.image && <Image source={{ uri: data.image }} style={styles.wordImage} resizeMode="cover" />}
    <View style={styles.innerCard}>
      <View style={styles.row}>
        <Typography variant="header">{data.original}</Typography>
        <Ionicons name="volume-medium" size={28} color="#2196F3" />
      </View>
      <Typography variant="body" style={styles.translation}>{data.translation}</Typography>
      {data.example && (
        <View style={styles.exampleBox}>
          <Typography variant="caption">Пример:</Typography>
          <Typography variant="body">{data.example}</Typography>
        </View>
      )}
    </View>
  </View>
);

const InternalGrammarCard = ({ data }) => (
  <ScrollView style={styles.cardContainer}>
    <View style={styles.badge}><Typography variant="caption" style={{color: '#fff'}}>ГРАММАТИКА</Typography></View>
    <Typography variant="header" style={{marginVertical: 10}}>{data.title}</Typography>
    <View style={styles.ruleBox}>
      <Typography variant="body" style={{fontWeight: 'bold'}}>{data.rule}</Typography>
    </View>
    <Typography variant="body">{data.explanation}</Typography>
    {data.example && (
        <View style={[styles.exampleBox, {marginTop: 20}]}>
          <Typography variant="caption">Пример использования:</Typography>
          <Typography variant="body">{data.example}</Typography>
        </View>
      )}
  </ScrollView>
);

const InternalQuizCard = ({ data, onCorrect }) => (
  <View style={styles.cardContainer}>
    <Typography variant="header" style={{marginVertical: 10}}>{data.question}</Typography>
    {data.options?.map((opt, i) => (
      <TouchableOpacity 
        key={i} 
        style={styles.optionBtn} 
        onPress={() => opt === data.correct ? onCorrect() : Alert.alert("Неверно", "Попробуй другой вариант")}
      >
        <Typography variant="body">{opt}</Typography>
      </TouchableOpacity>
    ))}
  </View>
);

export default function LessonScreen({ route, navigation }) {
  const { lessonData } = route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // ГЛАВНОЕ ИСПРАВЛЕНИЕ: Универсальная сборка контента
  const prepareContent = () => {
    if (!lessonData) return [];
    
    // 1. Если данные уже в новом формате (массив content)
    if (lessonData.content && Array.isArray(lessonData.content)) {
      return lessonData.content;
    }

    // 2. Если данные в старом формате (слова, грамматика отдельно)
    let combined = [];
    if (lessonData.grammar) combined.push({ ...lessonData.grammar, type: 'grammar' });
    if (Array.isArray(lessonData.words)) {
      lessonData.words.forEach(w => combined.push({ ...w, type: 'word' }));
    }
    if (Array.isArray(lessonData.quiz)) {
      lessonData.quiz.forEach(q => combined.push({ ...q, type: 'quiz' }));
    }
    return combined;
  };

  const content = prepareContent();
  const currentStep = content[currentIndex];

  // Если контент не найден
  if (!currentStep) {
    return (
      <ScreenWrapper>
        <View style={styles.center}>
          <Typography variant="header">Урок пуст</Typography>
          <Typography variant="body" style={{textAlign: 'center', marginVertical: 10}}>
            Не удалось найти контент в lessonData.id: {lessonData.id}
          </Typography>
          <Button title="Назад" onPress={() => navigation.goBack()} />
        </View>
      </ScreenWrapper>
    );
  }

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      saveProgress();
    }
  };

  const saveProgress = async () => {
  setLoading(true);
  try {
    const uid = auth.currentUser.uid
    const userRef = doc(db, "users", uid);

    const newWords = lessonData.content
    .filter(item => item.type === 'word')
    .map(item => ({original: item.original, translation: item.translation}));

    const newGrammar = lessonData.content
    .filter(item => item.type === 'grammar')
    .map(item => item.title || item.rule);

    await updateDoc(userRef, { 
      completedLessons: arrayUnion(lessonData.id),
      learnedWords: arrayUnion(...newWords),
      learnedGrammar: arrayUnion(...newGrammar)
    });
    
    Alert.alert("Поздравляем!", "Урок успешно пройден!");
    navigation.goBack()
    
    // Возвращаемся и кидаем флаг, что надо обновить данные
  } catch (e) {
    console.error(e);
    Alert.alert("Ошибка", "Не удалось сохранить прогресс");
  } finally {
    setLoading(false);
  }
};

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <HeaderButton type="close" onPress={() => navigation.goBack()} />
        <View style={styles.prog}>
          <ProgressBar progress={(currentIndex + 1) / content.length} />
        </View>
      </View>

      <View style={styles.main}>
        {loading ? <ActivityIndicator size="large" color="#2196F3" /> : (
          <View style={{flex: 1, width: '100%'}}>
            {currentStep.type === 'word' && <InternalWordCard data={currentStep} />}
            {currentStep.type === 'grammar' && <InternalGrammarCard data={currentStep} />}
            {currentStep.type === 'quiz' && <InternalQuizCard data={currentStep} onCorrect={handleNext} />}
          </View>
        )}
      </View>

      {currentStep.type !== 'quiz' && !loading && (
        <View style={styles.footer}>
          <Button title={currentIndex === content.length - 1 ? "Завершить" : "Далее"} onPress={handleNext} />
        </View>
      )}
    </ScreenWrapper>
  );
}