import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, doc, onSnapshot, query, orderBy } from "firebase/firestore";

// Импорт стилей
import { styles } from './styles';

// Импорт компонентов
import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { LessonButton } from '../../components/lesson-button/LessonButton';
import { Typography } from '../../components/typography/Typography';

export default function HomeScreen({ navigation }) {
  const [lessons, setLessons] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    const uid = auth.currentUser.uid;

    const userDocRef = doc(db, "users", uid);
    const unsubUser = onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        setUserData(snapshot.data());
      } else {
        setUserData({
          completedLessons: [],
          learnedWords: [],
          learnedGrammar: []
        });
      }
      setLoading(false);
    }, (error) => {
      console.error("Ошибка при получении данных пользователя:", error);
      setLoading(false);
    });

    const fetchLessons = async () => {
      try {
        const q = query(collection(db, "lessons"), orderBy("order", "asc"));
        const querySnapshot = await getDocs(q);
        const lessonsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setLessons(lessonsList);
      } catch (error) {
        console.error("Ошибка при загрузке уроков:", error);
      }
    };

    fetchLessons();

    // Отписываемся от слушателя при выходе с экрана
    return () => unsubUser();
  }, []);

  // Функция расчета статуса урока
  const getLessonStatus = (lesson, index) => {
    if (!userData) return 'locked';
    
    const completedIds = userData.completedLessons || [];
    
    // Если урок уже пройден
    if (completedIds.includes(lesson.id)) {
      return 'completed';
    }

    // Логика открытия: урок доступен, если он первый 
    // или если предыдущий урок находится в списке пройденных
    const isFirstLesson = index === 0;
    const prevLessonId = index > 0 ? lessons[index - 1]?.id : null;
    const isPrevCompleted = isFirstLesson || completedIds.includes(prevLessonId);

    if (isPrevCompleted) {
      // Если это тест — можно вернуть 'test', иначе 'available'
      return lesson.type === 'test' ? 'test' : 'available';
    }

    return 'locked';
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00F0FF" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      {/* Шапка с общей инфой */}
      <View style={styles.header}>
        <Typography variant="header">Греческий язык</Typography>
        <Typography variant="body" style={styles.subtitle}>
          Выучено слов: {userData?.learnedWords?.length || 0}
        </Typography>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {lessons.map((lesson, index) => {
    const status = getLessonStatus(lesson, index);

    return (
      <View key={lesson.id} style={styles.lessonStepContainer}>
        
        {/* Рисуем прямую линию ПЕРЕД уроком */}
        {index > 0 && (
          <View style={[
            styles.verticalLine, 
            status !== 'locked' && styles.lineActive // Линия светится, если урок доступен
          ]} />
        )}

        {/* Кнопка урока */}
        <LessonButton
          title={lesson.title}
          status={status}
          onPress={() => {
            if (status === 'locked') {
              Alert.alert("Урок закрыт", "Пройдите предыдущий урок");
            } else {
              navigation.navigate('LessonScreen', { lessonData: lesson });
            }
          }}
        />
      </View>
    );
  })}

        {lessons.length === 0 && !loading && (
          <View style={styles.loaderContainer}>
            <Typography variant="body">Уроки загружаются или отсутствуют...</Typography>
          </View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
}