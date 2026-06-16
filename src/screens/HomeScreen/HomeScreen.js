import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, doc, onSnapshot, query, orderBy, updateDoc } from "firebase/firestore";

// Импорт стилей
import { styles } from './styles';

// Импорт компонентов
import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { LessonButton } from '../../components/lesson-button/LessonButton';
import { Typography } from '../../components/typography/Typography';
import StreakBar from '../../components/streak-bar/StreakBar';

export default function HomeScreen({ navigation }) {
  const user = auth.currentUser;
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
    
    // Переменная предотвращает повторные сетевые запросы при обновлениях внутри одной сессии
    let isChecked = false;

    const unsubUser = onSnapshot(userDocRef, async (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserData(data);

        // МГНОВЕННАЯ ПРОВЕРКА И СБРОС СТРИКА ПРИ ЗАХОДЕ
        if (data.lastActivityDate && data.currentStreak > 0 && !isChecked) {
          isChecked = true; 

          // Получаем защищенные сетевые дни
          let todayDays = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
          try {
            const response = await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");
            const resData = await response.json();
            todayDays = Math.floor(new Date(resData.utc_datetime).getTime() / (1000 * 60 * 60 * 24));
          } catch (e) {}

          const lastDays = Math.floor((data.lastActivityDate.seconds * 1000) / (1000 * 60 * 60 * 24));

          // Если прошло больше 1 календарного дня с момента активности — стрик сгорел
          if (todayDays - lastDays > 1) {
            try {
              await updateDoc(userDocRef, { currentStreak: 0 });
              console.log("Стрик мгновенно обнулен в бд, так как время вышло.");
            } catch (err) {
              console.error("Ошибка сброса стрика:", err);
            }
          }
        }
      } else {
        setUserData({
          completedLessons: [],
          learnedWords: [],
          learnedGrammar: [],
          currentStreak: 0
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

    return () => unsubUser();
  }, []);

  const getLessonStatus = (lesson, index) => {
    if (!userData) return 'locked';
    const completedIds = userData.completedLessons || [];
    if (completedIds.includes(lesson.id)) {
      return 'completed';
    }
    const isFirstLesson = index === 0;
    const prevLessonId = index > 0 ? lessons[index - 1]?.id : null;
    const isPrevCompleted = isFirstLesson || completedIds.includes(prevLessonId);

    if (isPrevCompleted) {
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
      <View style={styles.header}>
        <Typography variant='header' style={styles.headerTitle}>Привет, {userData?.nickname ? userData.nickname : (user?.displayName || "Ученик")}</Typography>
        <StreakBar
          streak={userData?.currentStreak || 0}
          lastActivityDate={userData?.lastActivityDate}
        />  
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {lessons.map((lesson, index) => {
          const status = getLessonStatus(lesson, index);
          return (
            <View key={lesson.id} style={styles.lessonStepContainer}>
              {index > 0 && (
                <View style={[styles.verticalLine, status !== 'locked' && styles.lineActive]} />
              )}
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