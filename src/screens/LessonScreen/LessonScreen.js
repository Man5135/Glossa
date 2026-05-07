import React, { useState } from 'react';
import { 
  View, 
  Alert, 
  ActivityIndicator, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import * as Speech from 'expo-speech';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from '../../firebase/config';
import { Ionicons } from '@expo/vector-icons';

import { styles } from './styles'; // Все стили теперь здесь
import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { HeaderButton } from '../../components/header-button/HeaderButton';
import { ProgressBar } from '../../components/progress-bar/ProgressBar';
import { Button } from '../../components/button/Button';
import { Typography } from '../../components/typography/Typography';
import { Audio } from 'expo-av';

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

const speak = (text) => {
  Speech.speak(text, { language: 'el', pitch: 0.9, rate: 0.8 });
};

// --- Вспомогательный компонент таблицы ---
const RenderTable = ({ data }) => {
  if (!data || !Array.isArray(data)) return null;

  return (
    <View style={styles.tableContainer}>
      {data.map((row, index) => (
        <View key={index} style={[styles.tableRow, index % 2 === 0 && styles.tableRowEven]}>
          <Typography variant="body" style={styles.tableCellLeft}>{row.col1}</Typography>
          <Typography variant="body" style={styles.tableCellRight}>{row.col2}</Typography>
        </View>
      ))}
    </View>
  );
};

// --- Компоненты карточек ---
const InternalGrammarCard = ({ data }) => (
  <ScrollView style={styles.cardContainer} contentContainerStyle={{ paddingBottom: 20 }}>
    <View style={styles.innerCard}>
      <Typography variant="header" style={{ color: '#00F0FF', marginBottom: 15 }}>
        {data.title}
      </Typography>
      
      {data.rule && (
        <View style={styles.ruleBadge}>
          <Typography variant="body" style={{ fontWeight: 'bold', color: '#00F0FF' }}>{data.rule}</Typography>
        </View>
      )}

      <Typography variant="body" style={{ lineHeight: 24, marginBottom: 20 }}>
        {data.explanation || data.fullText}
      </Typography>

      <RenderTable data={data.table} />
    </View>
  </ScrollView>
);

const InternalWordCard = ({ data }) => (
  <View style={styles.cardContainer}>
    {data.image && <Image source={{ uri: data.image }} style={styles.wordImage} resizeMode="cover" />}
    <View style={styles.innerCard}>
      <View style={styles.row}>
        <Typography variant="header" style={{ color: '#00F0FF', flex: 1 }}>{data.original}</Typography>
        <TouchableOpacity onPress={() => speak(data.original)}>
          <Ionicons name="volume-medium-outline" size={32} color="#00F0FF" />
        </TouchableOpacity>
      </View>
      <Typography variant="header" style={{ marginTop: 20 }}>{data.translation}</Typography>
      {data.example && (
        <View style={styles.exampleBox}>
          <Typography variant="caption" style={{ color: '#555' }}>Пример:</Typography>
          <Typography variant="body" style={{ fontStyle: 'italic' }}>{data.example}</Typography>
        </View>
      )}
    </View>
  </View>
);

const InternalQuizCard = ({ data, onCorrect }) => {
  const [selected, setSelected] = useState(null);

  const checkAnswer = async (option) => {
    setSelected(option);
    
    if (option === data.correct) {
      await playFeedbackSound(true);
      setTimeout(onCorrect, 600);
    } else {
      await playFeedbackSound(false);
      Alert.alert("Ошибка", "Попробуй другой вариант");
    }
  };

  return (
    <View style={styles.cardContainer}>
      <Typography variant="header" style={{ marginBottom: 30, textAlign: 'center' }}>
        {data.question}
      </Typography>
      {data.options.map((option, index) => (
        <TouchableOpacity 
          key={index} 
          style={[
            styles.optionButton,
            selected === option && (option === data.correct ? styles.correctOption : styles.wrongOption)
          ]}
          onPress={() => checkAnswer(option)}
        >
          <Typography variant="body" style={{ color: selected === option ? '#000' : '#FFF' }}>
            {option}
          </Typography>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function LessonScreen({ route, navigation }) {
  const { lessonData } = route.params;
  const content = lessonData.content || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const currentStep = content[currentIndex];

  const handleNext = () => {
    if (currentIndex < content.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      saveProgress();
    }
  };

  const saveProgress = async () => {
    setLoading(true);
    try {
      const uid = auth.currentUser?.uid;
      const userRef = doc(db, "users", uid);
      const newWords = content.filter(i => i.type === 'word').map(i => i.id);
      const newGrammar = content.filter(i => i.type === 'grammar').map(i => i.id);

      await updateDoc(userRef, {
        completedLessons: arrayUnion(lessonData.id),
        learnedWords: arrayUnion(...newWords),
        learnedGrammar: arrayUnion(...newGrammar)
      });
      
      Alert.alert("Успех!", "Урок пройден");
      navigation.goBack();
    } catch (e) {
      Alert.alert("Ошибка", "Не удалось сохранить результат");
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
        {loading ? <ActivityIndicator size="large" color="#00F0FF" /> : (
          <View style={{ flex: 1, width: '100%' }}>
            {currentStep.type === 'word' && <InternalWordCard data={currentStep} />}
            {currentStep.type === 'grammar' && <InternalGrammarCard data={currentStep} />}
            {currentStep.type === 'quiz' && <InternalQuizCard data={currentStep} onCorrect={handleNext} />}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <Button 
          title={currentIndex === content.length - 1 ? "Завершить" : "Далее"} 
          onPress={handleNext} 
          disabled={currentStep.type === 'quiz'}
        />
      </View>
    </ScreenWrapper>
  );
}