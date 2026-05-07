import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { Typography } from '../../components/typography/Typography';
import { styles } from './styles';

export default function GrammarScreen({ navigation }) {
  const [topics, setTopics] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]); // Храним пройденные ID уроков
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Загружаем библиотеку грамматики
    const fetchLibrary = async () => {
      try {
        const snap = await getDocs(collection(db, "grammar_library"));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        // Сортируем по порядку, если нужно
        setTopics(list.sort((a, b) => (a.order || 0) - (b.order || 0)));
      } catch (e) {
        console.error("Ошибка загрузки библиотеки:", e);
      }
    };

    // 2. Слушаем изменения в профиле пользователя (пройденные уроки)
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    const userRef = doc(db, "users", uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Берем массив пройденных уроков (напр. ["lesson_1", "lesson_5"])
        setCompletedLessons(userData.completedLessons || []);
      }
      setLoading(false);
    });

    fetchLibrary();
    return () => unsub();
  }, []);

  const handlePress = (item) => {
    if (!navigation) return;

    navigation.navigate('LessonScreen', { 
      lessonData: {
        id: item.id, // Передаем ID темы, чтобы при завершении она тоже могла отметиться
        title: item.title,
        content: [
          {
            type: 'grammar',
            title: item.title,
            explanation: item.fullText || item.explanation || "Описание отсутствует",
            table: item.table || null,
            id: item.id
          }
        ]
      } 
    });
  };

  const renderItem = ({ item }) => {
    // ЛОГИКА ЗАМКА:
    // Тема открыта, если:
    // 1. У неё вообще нет условия (unlockLessonId отсутствует)
    // 2. Либо ID требуемого урока содержится в массиве completedLessons пользователя
    const isUnlocked = !item.unlockLessonId || completedLessons.includes(item.unlockLessonId);

    return (
      <TouchableOpacity 
        style={[styles.card, !isUnlocked && styles.lockedCard]}
        disabled={!isUnlocked}
        onPress={() => handlePress(item)}
      >
        <View style={{ flex: 1 }}>
          <Typography variant="header" style={[
            { fontSize: 18 },
            !isUnlocked && styles.lockedText
          ]}>
            {item.title}
          </Typography>
          <Typography variant="caption" style={{ color: isUnlocked ? '#00F0FF' : '#555' }}>
            {isUnlocked 
              ? (item.category || "Грамматика") 
              : `Пройдите ${item.unlockLessonId.replace('_', ' ')}, чтобы открыть`}
          </Typography>
        </View>
        
        <Ionicons 
          name={isUnlocked ? "chevron-forward" : "lock-closed"} 
          size={22} 
          color={isUnlocked ? "#00F0FF" : "#444"} 
        />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <ScreenWrapper>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#00F0FF" />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Typography variant="header">Справочник</Typography>
        <Typography variant="body" style={{ color: '#888' }}>
          Доступно тем: {topics.filter(t => !t.unlockLessonId || completedLessons.includes(t.unlockLessonId)).length}
        </Typography>
      </View>

      <FlatList
        data={topics}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
        ListHeaderComponent={() => (
          <TouchableOpacity
            style={[styles.card, { borderColor: '#00F0FF', borderWidth: 1, marginBottom: 20 }]} 
            onPress={() => navigation.navigate('Alphabet')}
          >
            <View style={{ flex: 1 }}>
              <Typography variant="header" style={{ color: '#00F0FF', fontSize: 18 }}>
                🇬🇷 Греческий алфавит
              </Typography>
              <Typography variant="caption" style={{ color: '#aaa' }}>
                Основы чтения и произношение
              </Typography>
            </View>
            <Ionicons name="musical-notes-outline" size={24} color="#00F0FF" />
          </TouchableOpacity>
        )}
      />
    </ScreenWrapper>
  );
}