import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { db, auth } from '../../firebase/config';
import { collection, getDocs, doc, onSnapshot } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../components/screen-wrapper/ScreenWrapper';
import { Typography } from '../../components/typography/Typography';
import { styles } from './styles';
import { Button } from '../../components/button/Button';

// ОБЯЗАТЕЛЬНО принимаем navigation как пропс
export default function GrammarScreen({ navigation }) {
  const [topics, setTopics] = useState([]);
  const [userGrammar, setUserGrammar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const snap = await getDocs(collection(db, "grammar_library"));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setTopics(list);
      } catch (e) {
        console.error("Ошибка загрузки библиотеки:", e);
      }
    };

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const userRef = doc(db, "users", uid);
    const unsub = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setUserGrammar(docSnap.data().learnedGrammar || []);
      }
      setLoading(false);
    });

    fetchLibrary();
    return () => unsub();
  }, []);

  const handlePress = (item) => {
    // Проверяем, существует ли объект навигации, чтобы не уронить приложение
    if (!navigation) {
      console.error("Navigation prop is missing!");
      return;
    }

    navigation.navigate('LessonScreen', { 
      lessonData: {
        title: item.title,
        // Формируем контент так, как его ждет LessonScreen.js
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
    const isUnlocked = userGrammar.includes(item.id) || userGrammar.includes(item.title);

    return (
      <TouchableOpacity 
        style={[styles.card, !isUnlocked && styles.lockedCard]}
        disabled={!isUnlocked}
        onPress={() => handlePress(item)}
      >
        <View style={{ flex: 1 }}>
          <Typography variant="header" style={!isUnlocked && styles.lockedText}>
            {item.title}
          </Typography>
          <Typography variant="caption" style={{ color: isUnlocked ? '#00F0FF' : '#888' }}>
            {item.category || "Грамматика"}
          </Typography>
        </View>
        <Ionicons 
          name={isUnlocked ? "chevron-forward" : "lock-closed"} 
          size={24} 
          color={isUnlocked ? "#00F0FF" : "#555"} 
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
          Изучено тем: {userGrammar.length}
        </Typography>
      </View>
      <View>
        <TouchableOpacity
            style={[styles.card, { borderColor: '#00F0FF', borderWidth: 1 }]} 
            onPress={() => navigation.navigate('Alphabet')} // Правильный вызов навигации
          >
            <View style={{ flex: 1 }}>
              <Typography variant="header" style={{ color: '#00F0FF' }}>
                🇬🇷 Греческий алфавит
              </Typography>
              <Typography variant="caption" style={{ color: '#aaa' }}>
                Основы чтения и произношение
              </Typography>
            </View>
            <Ionicons name="volume-medium-outline" size={24} color="#00F0FF" />
          </TouchableOpacity>
      </View>
      <FlatList
        data={topics}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 15 }}
      />
    </ScreenWrapper>
  );
}